package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"

	"github.com/julienschmidt/httprouter"
	sqlite3 "github.com/mattn/go-sqlite3"
)

var validUsername = regexp.MustCompile(`^[a-z][a-z0-9_]*$`)

func (s *server) addUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if !validUsername.Match(username) {
		http.Error(w, fmt.Sprintf("invalid username %q", username), http.StatusBadRequest)
		return
	}

	// The conversion to string makes sure the username is stored as TEXT, not BLOB;
	// see https://www.sqlite.org/datatype3.html.
	_, err = s.db.Exec(`INSERT INTO users (username) VALUES (?)`, string(username))
	if e, ok := err.(sqlite3.Error); ok && e.ExtendedCode == sqlite3.ErrConstraintUnique {
		http.Error(w, fmt.Sprintf("duplicate username %q", username), http.StatusConflict)
		return
	}

	if err != nil {
		http.Error(w, "database error", http.StatusInternalServerError)
		log.Print(err)
		return
	}
}

func (s *server) listUsers(tx *sql.Tx, w http.ResponseWriter, r *http.Request, ps httprouter.Params) (err error) {
	rows, err := tx.Query(`SELECT username FROM users`)
	if err != nil {
		return
	}
	defer rows.Close()

	var (
		username  string
		usernames = make([]string, 0)
	)
	for rows.Next() {
		rows.Scan(&username)
		usernames = append(usernames, username)
	}
	if err = rows.Err(); err != nil {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(usernames)
}

// Logs in using the username provided in the X-User header.
// Returns the user's id.
//
// Errors are reported on w and logged.
func login(w http.ResponseWriter, r *http.Request, tx *sql.Tx) (username string, userid int, err error) {
	// For the moment, we have a custom "authorization" header that contains
	// just the username. We can upgrade this to Basic-Auth or something fancy
	// later.
	username = r.Header.Get("X-User")
	if username == "" {
		const msg = "no username provided"
		log.Print(msg)
		http.Error(w, msg, http.StatusUnauthorized)
		err = errors.New(msg)
		return
	}

	row := tx.QueryRow(`SELECT userid FROM users WHERE username = ?`, username)
	err = row.Scan(&userid)
	return
}
