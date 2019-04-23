package main

import (
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	_ "github.com/mattn/go-sqlite3"
)

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
