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
	tx, err := s.db.Begin()
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			rollback(w, tx, err)
		}
	}()

	userid, err := login(w, r, tx)
	if err != nil {
		return
	}

	var ids []string
	err = json.NewDecoder(r.Body).Decode(&ids)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// elasticEndpoint == "" turns off validation, for testing purposes.
	if s.elasticEndpoint != "" && !s.validateId(w, r, ids) {
		return
	}

	for _, id := range ids {
		_, err = tx.Exec(`INSERT OR IGNORE INTO seed (id, userid) VALUES (?, ?)`,
			id, userid)
		if err != nil {
			return
		}
	}

	err = tx.Commit()
}

// ListPositives allows listing the union of seed set and positive assessments.
func (s *server) listPositives(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	tx, err := s.db.Begin()
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			rollback(w, tx, err)
		}
	}()

	userid, err := login(w, r, tx)
	if err != nil {
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

	rows, err := tx.Query(
		`SELECT * FROM (
			SELECT id FROM seed WHERE userid = ?
			UNION
			SELECT id FROM assessments WHERE userid = ?
		) LIMIT ? OFFSET ?`,
		userid, userid, size, offset)

	ids, err := gatherIds(rows, w)
	if err != nil {
		return
	}
	json.NewEncoder(w).Encode(ids)

	err = tx.Commit()
}

func (s *server) listSeed(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	tx, err := s.db.Begin()
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			rollback(w, tx, err)
		}
	}()

	userid, err := login(w, r, tx)
	if err != nil {
		return
	}

	ids, err := gatherSeed(w, tx, userid)
	if err != nil {
		return
	}
	json.NewEncoder(w).Encode(ids)

	err = tx.Commit()
}

// GatherSeed returns the seed set for the specified user. It reports any
// errors it encounters to w and log.
func gatherSeed(w http.ResponseWriter, tx *sql.Tx, userid int) (ids []string, err error) {
	rows, err := tx.Query(`SELECT id FROM seed WHERE userid = ?`, userid)
	if err != nil {
		log.Print("listSeed: ", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	return gatherIds(rows, w)
}

func gatherIds(rows *sql.Rows, w http.ResponseWriter) (ids []string, err error) {
	for rows.Next() {
		var id string
		if err = rows.Scan(&id); err != nil {
			log.Print("gatherIds: ", err)
			http.Error(w, "database error", http.StatusInternalServerError)
			return
		}
		ids = append(ids, id)
	}
	return
}

func (s *server) removeSeed(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	tx, err := s.db.Begin()
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			rollback(w, tx, err)
		}
	}()

	userid, err := login(w, r, tx)
	if err != nil {
		return
	}

	id := ps.ByName("id")
	// elasticEndpoint == "" turns off validation, for testing purposes.
	if s.elasticEndpoint != "" && !s.validateId(w, r, []string{id}) {
		return
	}

	res, err := tx.Exec(`DELETE FROM seed WHERE id = ? AND userid = ?`, id, userid)
	if err == nil {
		changed, err := res.RowsAffected()
		if err == nil && changed == 0 {
			notInSeedSet(w, id)
		}
	}
	if err != nil {
		log.Print("removeSeed: ", err)
		http.Error(w, "database error", http.StatusInternalServerError)
		return
	}

	err = tx.Commit()
}

func (s *server) seedContains(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	tx, err := s.db.Begin()
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			rollback(w, tx, err)
		}
	}()

	userid, err := login(w, r, tx)
	if err != nil {
		return
	}

	id := ps.ByName("id")
	row := tx.QueryRow(`SELECT 1 FROM seed WHERE id = ? AND userid = ?`, id, userid)

	var i int
	switch err = row.Scan(&i); err {
	case nil:
		// Report 200 to client. Currently no output.
		return
	case sql.ErrNoRows:
		notInSeedSet(w, id)
	default:
		log.Print("seedContains: ", err)
		http.Error(w, "database error", http.StatusInternalServerError)
	}

	err = tx.Commit()
}

func notInSeedSet(w http.ResponseWriter, id string) {
	http.Error(w, fmt.Sprintf("%q not in seed set", id), http.StatusNotFound)
}
