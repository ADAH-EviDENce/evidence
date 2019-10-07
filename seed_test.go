package main

import (
	"encoding/json"
	"fmt"
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

		testListSeed(t, r, "user1", "foo", "bar", "baz", "quux") &&
		testListSeed(t, r, "user2", "fred", "barney") &&

		testNumPositives(t, r, "user1", 4) &&
		testNumPositives(t, r, "user2", 2) &&

		removeSeed(t, r, "user1", "foo", http.StatusOK) &&
		removeSeed(t, r, "user1", "foo", http.StatusNotFound) &&
		removeSeed(t, r, "user2", "bar", http.StatusNotFound)
}

func addSeed(t *testing.T, r *httprouter.Router, username, ids string) bool {
	t.Helper()

	req := httptest.NewRequest("POST", "/seed", strings.NewReader(ids))
	req.Header.Set("X-User", username)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return assert.Equal(t, http.StatusOK, w.Result().StatusCode)
}

func testListSeed(t *testing.T, r *httprouter.Router, username string, expect ...string) bool {
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

func testNumPositives(t *testing.T, r *httprouter.Router, username string, expect int) bool {
	t.Helper()

	req := httptest.NewRequest("GET", "/positive/num", nil)
	req.Header.Set("X-User", username)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	res := w.Result()
	if !assert.Equal(t, http.StatusOK, w.Result().StatusCode) {
		return false
	}

	//n, err := strconv.Atoi(w.Body.String())
	var n int
	_, err := fmt.Fscanf(res.Body, "%d", &n)
	return assert.Nil(t, err) && assert.Equal(t, expect, n)
}

func removeSeed(t *testing.T, r *httprouter.Router, username, id string, status int) bool {
	t.Helper()

	req := httptest.NewRequest("DELETE", "/seed/"+id, nil)
	req.Header.Set("X-User", username)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	res := w.Result()
	return assert.Equal(t, status, res.StatusCode)
}
