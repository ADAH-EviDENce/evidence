package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/julienschmidt/httprouter"
	"github.com/stretchr/testify/assert"
)

func TestAddUser(t *testing.T) {
	db := newDatabase(t)
	defer db.Close()

	r := httprouter.New()
	newServer(db, "", "", r)

	req := httptest.NewRequest("POST", "/users", strings.NewReader("test1"))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	resp := w.Result()
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	// Duplicate username.
	req = httptest.NewRequest("POST", "/users", strings.NewReader("test1"))
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	resp = w.Result()
	assert.Equal(t, http.StatusConflict, resp.StatusCode)

	req = httptest.NewRequest("GET", "/users", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	resp = w.Result()
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, "application/json", w.HeaderMap.Get("Content-Type"))

	dec := json.NewDecoder(resp.Body)
	var usernames []string
	err := dec.Decode(&usernames)
	assert.Nil(t, err)
	assert.Equal(t, []string{"test1"}, usernames)
}
