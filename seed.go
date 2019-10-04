package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (s *server) addSeed(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username, err := getUsername(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var ids []string
	err = json.NewDecoder(r.Body).Decode(&ids)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
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

	// elasticEndpoint == "" turns off validation, for testing purposes.
	if s.elasticEndpoint != "" && !s.validateId(w, r, ids) {
		return
	}

	for _, id := range ids {
		_, err = tx.Exec(
			`INSERT OR IGNORE INTO seed (id, userid)
			SELECT ?, userid FROM users WHERE username = ?`,
			id, username)
		if err != nil {
			return
		}
	}

	err = tx.Commit()
}

func (s *server) listSeed(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username, err := getUsername(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	ids, err := s.gatherSeed(w, username)
	if err != nil {
		return
	}
	json.NewEncoder(w).Encode(ids)
}

// GatherSeed returns the seed set for the specified user. It reports any
// errors it encounters to w and log.
func (s *server) gatherSeed(w http.ResponseWriter, username string) (ids []string, err error) {
	rows, err := s.db.Query(
		`SELECT id FROM seed
		WHERE userid IN (SELECT userid FROM users WHERE username = ?)`,
		username)
	if err != nil {
		log.Print("listSeed: ", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id string
		if err = rows.Scan(&id); err != nil {
			log.Print(err)
			http.Error(w, "database error", http.StatusInternalServerError)
			return
		}
		ids = append(ids, id)
	}
	return
}

func (s *server) removeSeed(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username, err := getUsername(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	id := ps.ByName("id")
	// elasticEndpoint == "" turns off validation, for testing purposes.
	if s.elasticEndpoint != "" && !s.validateId(w, r, []string{id}) {
		return
	}

	res, err := s.db.Exec(
		`DELETE FROM seed WHERE id = ?
		AND userid IN (SELECT userid FROM users WHERE username = ?)`,
		id, username)
	if err == nil {
		changed, err := res.RowsAffected()
		if err == nil && changed == 0 {
			http.Error(w, fmt.Sprintf("%q not in seed set", id),
				http.StatusNotFound)
			return
		}
	}
	if err != nil {
		log.Print("removeSeed: ", err)
		http.Error(w, "database error", http.StatusInternalServerError)
	}
}

func (s *server) seedContains(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username, err := getUsername(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	id := ps.ByName("id")
	row := s.db.QueryRow(
		`SELECT 1 FROM seed WHERE id = ?
		AND userid IN (SELECT userid FROM users WHERE username = ?)`,
		id, username)

	var i int
	switch err = row.Scan(&i); err {
	case nil:
		// Report 200 to client. Currently no output.
		return
	case sql.ErrNoRows:
		http.Error(w, "not in seed set", http.StatusNotFound)
	default:
		log.Print(err)
		http.Error(w, "database error", http.StatusInternalServerError)
	}
}
