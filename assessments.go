package main

import (
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"
)

type assessment struct {
	Id       string `json:"id"`
	Relevant string `json:"relevant"` // "yes", "no" or ""
}

func (s *server) addAssessment(tx *sql.Tx, w http.ResponseWriter, r *http.Request, ps httprouter.Params) (err error) {
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

	return s.addAssessments(tx, assessments, time.Now(), userId(r))
}

// Add assessments with timestamp t and the given user id.
// Does not commit or roll back tx.
func (s *server) addAssessments(tx *sql.Tx, assess []assessment, t time.Time, userid int) (err error) {
	insert, err := tx.Prepare(fmt.Sprintf(
		`INSERT INTO assessments (id, relevant, userid, timestamp) VALUES (?, ?, ?, ?)`))
	if err != nil {
		return
	}

	for _, a := range assess {
		relevant := sql.NullBool{Bool: false, Valid: false}

		switch a.Relevant {
		case "yes":
			relevant.Bool = true
			relevant.Valid = true
		case "no":
			relevant.Valid = true
		case "":
		}

		_, err = insert.Exec(a.Id, relevant, userid, t)
		if err != nil {
			return
		}
	}

	return
}

// Exports the entire assessments table in CSV format.
func (s *server) export(tx *sql.Tx, w http.ResponseWriter, r *http.Request, ps httprouter.Params) (err error) {
	rows, err := tx.Query(`SELECT id, relevant, username, timestamp
		FROM assessments a JOIN users u ON a.userid = u.userid
		WHERE u.userid = ?`, userId(r))
	if err != nil {
		return
	}
	defer rows.Close()

	cw := csv.NewWriter(w)
	w.Header().Set("Content-Type", "text/csv")

	for rows.Next() {
		var (
			id        string
			relevant  sql.NullBool
			timestamp time.Time
			username  string
		)
		rows.Scan(&id, &relevant, &username, &timestamp)

		text, err := s.getSource(r.Context(), w, id)
		if err != nil {
			log.Printf("Failed to get source for %q: %v\n", id, err)
			text = ""
		}

		t, _ := timestamp.MarshalText()
		row := [...]string{id, stringOfBool(relevant), username, string(t), text}
		// No error checking here. What can go wrong is a connection error,
		// which we can't report to the client.
		cw.Write(row[:])
	}
	cw.Flush()

	return rows.Err()
}

// Reads identifiers (JSON list of strings) from body, writes assessments for
// designated snippets.
func (s *server) getAssessment(tx *sql.Tx, w http.ResponseWriter, r *http.Request, ps httprouter.Params) (err error) {
	var ids []string
	err = json.NewDecoder(r.Body).Decode(&ids)
	if err != nil && err != io.EOF {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if !s.validateId(w, r, ids) {
		return
	}

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

	return json.NewEncoder(w).Encode(result)
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
