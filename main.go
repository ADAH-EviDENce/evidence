package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "relevance.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := httprouter.New()
	assessDB{db: db}.installHandler(r)
	r.GET("/es/*path", elasticsearch)
	r.ServeFiles("/static/*filepath", http.Dir("static"))

	log.Fatal(http.ListenAndServe(":8080", r))
}

type assessDB struct {
	db *sql.DB
}

func (db assessDB) installHandler(r *httprouter.Router) {
	r.POST("/assess", db.add)
	r.GET("/assess", db.get)
}

type assessment struct {
	Id       string `json:"id"`
	Relevant string `json:"relevant"` // "yes", "no" or ""
}

func (db assessDB) add(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var assessments []assessment

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	err := dec.Decode(&assessments)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	for _, a := range assessments {
		switch a.Relevant {
		case "yes", "no", "":
		default:
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, `relevant must be "yes", "no" or empty, got %q`, a.Relevant)
			return
		}
	}

	// TODO validate identifiers against Elasticsearch.

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

		_, err = tx.Exec(`INSERT INTO assessments VALUES (?, ?)`, a.Id, relevant)
		if err != nil {
			return
		}
	}

	err = tx.Commit()
	if err != nil {
		return
	}
}

func (db assessDB) get(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var ids []string
	err := json.NewDecoder(r.Body).Decode(&ids)
	if err != nil && err != io.EOF {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result := make([]assessment, 0)
	for _, id := range ids {
		var relevant sql.NullBool
		err = db.db.QueryRow(`SELECT relevant FROM assessments WHERE id = ?`, id).Scan(&relevant)
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
func elasticsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	url := "http://localhost:9200" + ps.ByName("path")
	q := r.URL.RawQuery
	if q != "" {
		url += "?" + q
	}

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "cannot reach Elasticsearch", http.StatusInternalServerError)
		log.Printf("%v", err)
		return
	}

	// Replace w's header by resp's header.
	hdr := w.Header()
	for k := range hdr {
		hdr.Del(k)
	}
	for k, vs := range resp.Header {
		for _, v := range vs {
			hdr.Add(k, v)
		}
	}

	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
