package main

import (
	"context"
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"path"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/julienschmidt/httprouter"
	"github.com/knaw-huc/evidence-gui/internal/doc2vec"
	_ "github.com/mattn/go-sqlite3"
	"github.com/olivere/elastic"
)

func main() {
	var (
		dbFile = flag.String("db", "relevance.db",
			"filename of relevance database")
		doc2vecFile = flag.String("doc2vec", "",
			"filename of doc2vec output (CSV)")
		elasticEndpoint = flag.String("elastic", "http://localhost:9200",
			"Elasticsearch endpoint")
	)
	flag.Parse()

	db, err := sql.Open("sqlite3", *dbFile)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := httprouter.New()
	newServer(db, *doc2vecFile, *elasticEndpoint, r)

	log.Fatal(http.ListenAndServe(":8080", r))
}

// A server encapsulates an assessment database and an Elasticsearch proxy.
type server struct {
	db              *sql.DB
	d2vIndex        *doc2vec.Index
	elasticEndpoint string
	elasticProxy    *httputil.ReverseProxy
	uiDir           string // Directory containing ui files. Defaults to "ui".
}

func newServer(db *sql.DB, doc2vecFile string, elasticEndpoint string, r *httprouter.Router) *server {
	esURL, err := url.Parse(elasticEndpoint)
	if err != nil {
		log.Fatal(err)
	}

	s := &server{
		db:              db,
		elasticEndpoint: elasticEndpoint,
		uiDir:           "ui",
	}

	// Doc2vec can be disabled for testing.
	if doc2vecFile != "" {
		s.d2vIndex, err = doc2vec.NewIndexFromCSV(doc2vecFile)
		if err != nil {
			log.Fatal(err)
		}
	}

	r.Handler("GET", "/", http.RedirectHandler("/ui/", http.StatusPermanentRedirect))

	r.POST("/assess", s.add)
	r.GET("/assess", s.get)

	r.GET("/doc2vec/:id", s.doc2vecNearest)

	s.elasticProxy = httputil.NewSingleHostReverseProxy(esURL)

	r.GET("/es/*path", s.elasticsearch)
	r.POST("/es/*path", s.elasticsearch)

	r.GET("/export", s.export)

	r.GET("/ui/*path", s.ui)

	r.GET("/users", s.listUsers)
	r.POST("/users", s.addUser)

	return s
}

// Serve UI components. Any path that does not resolve to a file inside s.uiDir
// serves index.html instead, so the React router can take care of it.
//
// Roughly equivalent to the .htaccess rules
//
//	RewriteCond %{REQUEST_FILENAME} !-f
//	RewriteRule ^ index.html [QSA,L]
func (s *server) ui(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	path := httprouter.CleanPath(ps.ByName("path"))

	if path != "/favicon.png" && !strings.HasPrefix(path, "/static/") {
		path = "/index.html"
	}
	http.ServeFile(w, r, filepath.Join(s.uiDir, path))
	return
}

type assessment struct {
	Id       string `json:"id"`
	Relevant string `json:"relevant"` // "yes", "no" or ""
}

func (s *server) add(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username, err := getUsername(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var assessments []assessment

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	err = dec.Decode(&assessments)
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
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			rollback(w, tx, err)
		}
	}()

	var userid int
	row := tx.QueryRow(`SELECT userid FROM users WHERE username = ?`, username)
	if err = row.Scan(&userid); err != nil {
		return
	}

	insert, err := tx.Prepare(
		`INSERT INTO assessments (id, relevant, userid) VALUES (?, ?, ?)`)
	if err != nil {
		return
	}

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

		_, err = insert.Exec(a.Id, relevant, userid)
		if err != nil {
			return
		}
	}

	err = tx.Commit()
	if err != nil {
		return
	}
}

// Exports the entire assessments table in CSV format.
func (s *server) export(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	tx, err := s.db.Begin()
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			rollback(w, tx, err)
		}
	}()

	rows, err := tx.Query(`SELECT id, relevant, username
		FROM assessments a JOIN users ON a.userid`)
	if err != nil {
		return
	}
	defer rows.Close()

	cw := csv.NewWriter(w)
	w.Header().Set("Content-Type", "text/csv")

	for rows.Next() {
		var (
			id       string
			relevant sql.NullBool
			username string
		)
		rows.Scan(&id, &relevant, &username)

		row := [3]string{id, stringOfBool(relevant), username}
		// No error checking here. What can go wrong is a connection error,
		// which we can't report to the client.
		cw.Write(row[:])
	}
	cw.Flush()

	if err = rows.Err(); err != nil {
		return
	}

	tx.Commit()
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

	tx, err := s.db.Begin()
	if err != nil {
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	defer func() {
		if err != nil {
			rollback(w, tx, err)
		}
	}()

	selectRelevant, err := tx.Prepare(`SELECT relevant FROM assessments WHERE id = ?`)
	if err != nil {
		return
	}

	result := make([]assessment, 0)
	for _, id := range ids {
		var relevant sql.NullBool
		err = selectRelevant.QueryRow(id).Scan(&relevant)
		if err == sql.ErrNoRows {
			// For id not in database, we skip it in the output.
			err = nil
			continue
		}
		if err != nil {
			http.Error(w, "database error", http.StatusInternalServerError)
			log.Printf("%v", err)
			return
		}

		result = append(result, assessment{Id: id, Relevant: stringOfBool(relevant)})
	}

	tx.Commit()

	json.NewEncoder(w).Encode(result)
}

// MoreLikeThis query in doc2vec space.
func (s *server) doc2vecNearest(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := ps.ByName("id")
	if !s.validateId(w, r, []string{id}) {
		return
	}

	uparams := r.URL.Query()
	offset := intValue(w, uparams, "from", 0)
	if offset == -1 {
		return
	}
	size := intValue(w, uparams, "size", 10)
	if size == -1 {
		return
	}

	near, err := s.d2vIndex.Nearest(r.Context(), id, offset, size, nil)
	if err != nil {
		http.Error(w, "error in doc2vec nearest-neighbor search",
			http.StatusInternalServerError)
		log.Print(err)
		return
	}

	// Simulate Elasticsearch output.
	resp, err := s.mgetSnippets(r.Context(), w, near, true)
	if err != nil {
		return
	}

	// Set Found to false to suppress it from the output.
	for i := range resp.Docs {
		resp.Docs[i].Found = false
	}

	json.NewEncoder(w).Encode(map[string]map[string]interface{}{
		"hits": map[string]interface{}{
			"hits": resp.Docs,
		},
	})
}

// Returns -1 on error.
func intValue(w http.ResponseWriter, v url.Values, key string, def int) int {
	s := v.Get(key)
	if s == "" {
		return def
	}
	i, err := strconv.Atoi(s)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "invalid %s parameter: %q", key, s)
		return -1
	}
	return i
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
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
	}

	s.elasticProxy.ServeHTTP(w, r)
}

// Checks if snippets with the given ids exist in the ES index.
func (s *server) validateId(w http.ResponseWriter, r *http.Request, ids []string) (valid bool) {
	resp, err := s.mgetSnippets(r.Context(), w, ids, false)
	if err != nil {
		return false
	}

	for _, doc := range resp.Docs {
		if !doc.Found {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, "no snippet with id %q", doc.Id)
			return
		}
	}

	return true
}

func (s *server) mgetSnippets(ctx context.Context, w http.ResponseWriter, ids []string, fetchSource bool) (*elastic.MgetResponse, error) {
	es, err := elastic.NewSimpleClient(elastic.SetURL(s.elasticEndpoint))
	if err != nil {
		return nil, err
	}

	mget := es.MultiGet()
	for _, id := range ids {
		mget.Add(elastic.NewMultiGetItem().
			Id(id).
			Index("snippets").
			Type("snippet").
			FetchSource(elastic.NewFetchSourceContext(fetchSource)))
	}

	resp, err := mget.Do(ctx)
	if err != nil {
		log.Print(err)
		http.Error(w, "Error while connecting to Elasticsearch",
			http.StatusInternalServerError)
	}

	return resp, err
}

func rollback(w http.ResponseWriter, tx *sql.Tx, err error) {
	// We always report "database error", regardless of the actual error.
	http.Error(w, "database error", http.StatusInternalServerError)
	log.Printf("%v; rolling back", err)
	tx.Rollback()
}

func stringOfBool(b sql.NullBool) string {
	switch {
	case !b.Valid:
		return ""
	case b.Bool:
		return "yes"
	default:
		return "no"
	}
}
