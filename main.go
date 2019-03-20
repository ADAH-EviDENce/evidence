package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	elasticEndpoint := flag.String("elastic", "http://localhost:9200",
		"Elasticsearch endpoint")
	flag.Parse()

	db, err := sql.Open("sqlite3", "relevance.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := httprouter.New()
	assessDB{
		db:              db,
		elasticEndpoint: *elasticEndpoint,
	}.installHandler(r)

	r.ServeFiles("/static/*filepath", http.Dir("static"))

	log.Fatal(http.ListenAndServe(":8080", r))
}

type assessDB struct {
	db              *sql.DB
	elasticEndpoint string

	// Prepared statements.
	insertAssessment, selectRelevant *sql.Stmt
}

func (db assessDB) installHandler(r *httprouter.Router) {
	// db.db may be nil in tests.
	if db.db != nil {
		var err error
		db.insertAssessment, err = db.db.Prepare(`INSERT INTO assessments VALUES (?, ?)`)
		if err != nil {
			panic(err)
		}
		db.selectRelevant, err = db.db.Prepare(`SELECT relevant FROM assessments WHERE id = ?`)
		if err != nil {
			panic(err)
		}
	}

	r.POST("/assess", db.add)
	r.GET("/assess", db.get)
	r.GET("/es/*path", db.elasticsearch)
}

type assessment struct {
	Id       string `json:"id"`
	Relevant string `json:"relevant"` // "yes", "no" or ""
}

func (db *assessDB) add(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
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

	if !db.validateId(w, ids) {
		return
	}

	tx, err := db.db.Begin()
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

	insert := tx.Stmt(db.insertAssessment)

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
func (db *assessDB) get(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var ids []string
	err := json.NewDecoder(r.Body).Decode(&ids)
	if err != nil && err != io.EOF {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if !db.validateId(w, ids) {
		return
	}

	result := make([]assessment, 0)
	for _, id := range ids {
		var relevant sql.NullBool
		err = db.selectRelevant.QueryRow(id).Scan(&relevant)
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

// Proxy for Elasticsearch. Only passes through GET requests.
func (db *assessDB) elasticsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	url := db.elasticEndpoint + ps.ByName("path")
	q := r.URL.RawQuery
	if q != "" {
		url += "?" + q
	}

	r2, err := http.NewRequest("GET", url, r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Copy r's header to r2.
	for k := range r2.Header {
		r2.Header.Del(k)
	}
	for k, vs := range r.Header {
		r2.Header[k] = vs
	}

	resp, err := http.DefaultClient.Do(r2)
	if err != nil {
		http.Error(w, "cannot reach Elasticsearch", http.StatusInternalServerError)
		log.Printf("%v", err)
		return
	}
	defer resp.Body.Close()

	// Replace w's header by resp's header.
	wHeader := w.Header()
	for k := range wHeader {
		wHeader.Del(k)
	}
	for k, vs := range resp.Header {
		wHeader[k] = vs
	}

	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
	resp.Body.Close()
}

// Checks if snippets with the given ids exist in the ES index.
func (db *assessDB) validateId(w http.ResponseWriter, ids []string) (valid bool) {
	url := db.elasticEndpoint + "/snippets/snippet/_mget?_source=false"

	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)

	// ES multi-GET API wants list of {"_id": id}.
	esIds := make([]map[string]string, len(ids))
	for i, id := range ids {
		esIds[i] = map[string]string{"_id": id}
	}

	enc.Encode(map[string]interface{}{"docs": esIds})

	req, err := http.NewRequest("GET", url, &buf)
	if err != nil {
		// This means either the URL is invalid, or GET is no longer an HTTP verb.
		panic(err)
	}

	req.Header.Add("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		http.Error(w, "HTTP client error", http.StatusInternalServerError)
		if err == nil {
			log.Printf("Elasticsearch reports status %s\n", resp.Status)
		} else {
			log.Print(err)
		}
		return
	}
	defer resp.Body.Close()

	dec := json.NewDecoder(resp.Body)
	m := make(map[string][]struct {
		Found bool   `json:"found"`
		Id    string `json:"_id"`
	})
	err = dec.Decode(&m)
	if err == nil && len(m["docs"]) != len(ids) {
		err = errors.New("no docs or wrong number in Elasticsearch output")
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for i, result := range m["docs"] {
		if result.Id != ids[i] {
			http.Error(w, "Elasticsearch checked wrong id", http.StatusInternalServerError)
			return
		}
		if !result.Found {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, "invalid or unknown snippet %q", result.Id)
			return
		}
	}

	return true
}
