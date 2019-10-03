package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sort"
	"strings"
	"testing"

	"github.com/julienschmidt/httprouter"
	"github.com/stretchr/testify/assert"
)

func TestSeed(t *testing.T) {
	db := newDatabase(t, "user1", "user2")
	defer db.Close()

	r := httprouter.New()
	newServer(db, "", "", r)

	_ = addSeed(t, r, "user1", `["foo", "bar", "baz"]`) &&
		addSeed(t, r, "user1", `["bar", "baz", "quux"]`) &&
		addSeed(t, r, "user2", `["fred", "barney"]`) &&

		listSeed(t, r, "user1", "foo", "bar", "baz", "quux") &&
		listSeed(t, r, "user2", "fred", "barney")
}

func addSeed(t *testing.T, r *httprouter.Router, username, ids string) bool {
	t.Helper()

	req := httptest.NewRequest("POST", "/seed", strings.NewReader(ids))
	req.Header.Set("X-User", username)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return assert.Equal(t, http.StatusOK, w.Result().StatusCode)
}

func listSeed(t *testing.T, r *httprouter.Router, username string, expect ...string) bool {
	t.Helper()

	req := httptest.NewRequest("GET", "/seed", nil)
	req.Header.Set("X-User", username)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	res := w.Result()
	if !assert.Equal(t, http.StatusOK, res.StatusCode) {
		return false
	}

	var actual []string
	err := json.NewDecoder(res.Body).Decode(&actual)
	assert.Nil(t, err)
	sort.Strings(actual)
	sort.Strings(expect)
	return assert.Equal(t, expect, actual)
}
