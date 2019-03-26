package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"path"

	"github.com/julienschmidt/httprouter"
	_ "github.com/mattn/go-sqlite3"
	"github.com/olivere/elastic"
)

func main() {
	elasticEndpoint := flag.String("elastic", "http://localhost:9200",
		"Elasticsearch endpoint")
	flag.Parse()

	db, err := sql.Open("sqlite3", "/db/relevance.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := httprouter.New()
	newServer(db, *elasticEndpoint, r)

	r.Handler("GET", "/", http.RedirectHandler("/ui/", http.StatusPermanentRedirect))
	r.ServeFiles("/ui/*filepath", http.Dir("static"))

	log.Fatal(http.ListenAndServe(":8080", r))
}

// A server encapsulates an assessment database and an Elasticsearch proxy.
type server struct {
	db              *sql.DB
	elasticEndpoint string
	elasticProxy    *httputil.ReverseProxy

	// Prepared statements.
	insertAssessment, selectRelevant *sql.Stmt
}

func newServer(db *sql.DB, elasticEndpoint string, r *httprouter.Router) *server {
	esURL, err := url.Parse(elasticEndpoint)
	if err != nil {
		log.Fatal(err)
	}

	s := &server{db: db, elasticEndpoint: elasticEndpoint}

	// db may be nil in tests.
	if db != nil {
		var err error
		s.insertAssessment, err = db.Prepare(`INSERT INTO assessments VALUES (?, ?)`)
		if err != nil {
			panic(err)
		}
		s.selectRelevant, err = db.Prepare(`SELECT relevant FROM assessments WHERE id = ?`)
		if err != nil {
			panic(err)
		}
	}

	r.POST("/assess", s.add)
	r.GET("/assess", s.get)

	s.elasticProxy = httputil.NewSingleHostReverseProxy(esURL)

	r.GET("/es/*path", s.elasticsearch)
	r.POST("/es/*path", s.elasticsearch)

	return s
}

type assessment struct {
	Id       string `json:"id"`
	Relevant string `json:"relevant"` // "yes", "no" or ""
}

func (s *server) add(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var assessments []assessment

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	err := dec.Decode(&assessments)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ids := make([]string, len(assessments))
	for i, a := range assessments {
		switch a.Relevant {
		case "yes", "no", "":
		default:
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `relevant must be "yes", "no" or empty, got %q`, a.Relevant)
			return
		}

		ids[i] = a.Id
	}

	if !s.validateId(w, r, ids) {
		return
	}

	tx, err := s.db.Begin()
	defer func() {
		if err != nil {
			http.Error(w, "database error", http.StatusInternalServerError)
			log.Printf("%v; rolling back", err)
			if tx != nil {
				tx.Rollback()
			}
		}
	}()
	if err != nil {
		return
	}

	insert := tx.Stmt(s.insertAssessment)

	for _, a := range assessments {
		relevant := sql.NullBool{Bool: false, Valid: false}

		switch a.Relevant {
		case "yes":
			relevant.Bool = true
			relevant.Valid = true
		case "no":
			relevant.Valid = true
		case "":
		}

		_, err = insert.Exec(a.Id, relevant)
		if err != nil {
			return
		}
	}

	err = tx.Commit()
	if err != nil {
		return
	}
}

// Reads identifiers (JSON list of strings) from body, writes assessments for
// designated snippets.
func (s *server) get(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var ids []string
	err := json.NewDecoder(r.Body).Decode(&ids)
	if err != nil && err != io.EOF {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if !s.validateId(w, r, ids) {
		return
	}

	result := make([]assessment, 0)
	for _, id := range ids {
		var relevant sql.NullBool
		err = s.selectRelevant.QueryRow(id).Scan(&relevant)
		if err == sql.ErrNoRows {
			// For id not in database, we skip it in the output.
			continue
		}
		if err != nil {
			http.Error(w, "database error", http.StatusInternalServerError)
			log.Printf("%v", err)
			return
		}

		var rel string
		switch {
		case relevant.Bool:
			rel = "yes"
		case relevant.Valid && !relevant.Bool:
			rel = "no"
		}
		result = append(result, assessment{Id: id, Relevant: rel})
	}

	json.NewEncoder(w).Encode(result)
}

// Proxy for Elasticsearch. Only passes through GET requests
// and selected POST requests that don't modify the index.
func (s *server) elasticsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	r.URL.Path = ps.ByName("path")

	if r.Method == "POST" {
		switch path.Base(r.URL.Path) {
		case "_mget", "_search":
		default:
			// Same message that httprouter gives.
			w.WriteHeader(http.StatusMethodNotAllowed)
			io.WriteString(w, "Method Not Allowed")
			return
		}
	}

	s.elasticProxy.ServeHTTP(w, r)
}

// Checks if snippets with the given ids exist in the ES index.
func (s *server) validateId(w http.ResponseWriter, r *http.Request, ids []string) (valid bool) {
	es, err := elastic.NewSimpleClient(elastic.SetURL(s.elasticEndpoint))

	mget := es.MultiGet()
	for _, id := range ids {
		mget.Add(elastic.NewMultiGetItem().
			Id(id).
			Index("snippets").
			Type("snippet").
			FetchSource(elastic.NewFetchSourceContext(false)))
	}

	resp, err := mget.Do(r.Context())
	if err != nil {
		log.Print(err)
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, "Error while connecting to Elasticsearch")
		return
	}

	for _, doc := range resp.Docs {
		if !doc.Found {
			return
		}
	}

	return true
}
