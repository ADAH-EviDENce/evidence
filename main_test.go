package main

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/julienschmidt/httprouter"
	"github.com/stretchr/testify/assert"
)

func TestAssessments(t *testing.T) {
	tempdir, err := ioutil.TempDir("", "evidence-gui-test")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempdir)

	db, err := sql.Open("sqlite3", filepath.Join(tempdir, "relevance.db"))
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	schema, err := ioutil.ReadFile("schema.sql")
	if err == nil {
		_, err = db.Exec(string(schema))
	}
	if err != nil {
		t.Fatal(err)
	}

	r := httprouter.New()
	assessDB{db: db}.installHandler(r)

	req := httptest.NewRequest("GET", "/assess",
		strings.NewReader(`["foo", "bar", "baz"]`))

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	resp := w.Result()
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var rel []string
	json.NewDecoder(resp.Body).Decode(&rel)

	assert.Equal(t, []string{}, rel)

	req = httptest.NewRequest("POST", "/assess",
		strings.NewReader(`[
			{"id": "foo", "relevant": "yes"},
			{"id": "bar", "relevant": "no"},
			{"id": "baz", "relevant": ""}
		]`))

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Result().StatusCode)

	req = httptest.NewRequest("GET", "/assess",
		strings.NewReader(`["foo", "bar", "baz", "quux"]`))

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	resp = w.Result()
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var assess []assessment
	json.NewDecoder(resp.Body).Decode(&assess)
	assert.Equal(t, []assessment{
		{"foo", "yes"},
		{"bar", "no"},
		{"baz", ""},
		// no value for quux
	}, assess)
}
