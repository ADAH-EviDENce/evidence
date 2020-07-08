package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// Removes all assessments and the seed set for a specified user.
func purge(tx *sql.Tx, w http.ResponseWriter, r *http.Request, ps httprouter.Params) (err error) {
	userid := userId(r)
	log.Printf("purge by user %d", userid)
	for _, table := range []string{"assessments", "seed"} {
		_, err = tx.Exec(fmt.Sprintf(`DELETE FROM %s WHERE userid = ?`, table), userid)
		if err != nil {
			http.Error(w, "database error", http.StatusInternalServerError)
			log.Print("purge: ", err)
		}
	}
	return
}
