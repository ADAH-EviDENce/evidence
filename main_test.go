package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/stretchr/testify/assert"
)

func TestAssessments(t *testing.T) {
	es := mockElastic()
	defer es.Close()

	db := newDatabase(t, "test")
	defer db.Close()

	r := httprouter.New()
	newServer(db, "", es.URL, r)

	req := httptest.NewRequest("GET", "/assess",
		strings.NewReader(`["foo", "bar", "baz"]`))

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	resp := w.Result()
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var rel []string
	json.NewDecoder(resp.Body).Decode(&rel)

	assert.Empty(t, rel)

	req = httptest.NewRequest("POST", "/assess",
		strings.NewReader(`[
			{"id": "foo", "relevant": "yes"},
			{"id": "bar", "relevant": "no"},
			{"id": "baz", "relevant": ""}
		]`))
	req.Header.Set("X-User", "test")

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

	req = httptest.NewRequest("GET", "/purge", nil)
	req.Header.Set("X-User", "test")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Result().StatusCode)
}

func TestESProxy(t *testing.T) {
	es := mockElastic()
	defer es.Close()

	r := httprouter.New()
	newServer(nil, "", es.URL, r)

	req := httptest.NewRequest("GET", "/es/snippets/snippet/_mget", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	// We care about getting through to the proxied server,
	// not about its handling of incorrect requests.
	assert.NotEqual(t, http.StatusNotFound, w.Result().StatusCode)
}

func mockElastic() *httptest.Server {
	r := httprouter.New()
	r.GET("/_mget", mget)
	r.GET("/snippets/snippet/_mget", mget)

	return httptest.NewServer(r)
}

func mget(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	docs := make(map[string]struct{})
	for _, s := range []string{"foo", "bar", "baz", "quux"} {
		docs[s] = struct{}{}
	}

	var m map[string][]struct {
		Id    string `json:"_id"`
		Index string `json:"_index"`
		Type  string `json:"_type"`
	}
	err := json.NewDecoder(r.Body).Decode(&m)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rdocs, ok := m["docs"]
	if !ok {
		http.Error(w, `no "docs" in body JSON`, http.StatusBadRequest)
		return
	}

	io.WriteString(w, `{"docs": [`)

	for i, doc := range rdocs {
		if i > 0 {
			w.Write([]byte{','})
		}

		_, found := docs[doc.Id]
		fmt.Fprintf(w,
			`{"_index": "snippets", "_type": "snippet", "_id": %q, "found": %t}`,
			doc.Id, found)
	}

	io.WriteString(w, "]}")
}

func TestExport(t *testing.T) {
	db := newDatabase(t, "test")
	defer db.Close()

	r := httprouter.New()
	s := newServer(db, "", "", r)

	ts := "Mon Jan 2 15:04:05 -0700 MST 2006"

	assess := []assessment{
		{"foo", "yes"},
		{"bar", "no"},
		{"baz", ""},
	}

	tx, err := s.db.Begin()
	if err != nil {
		t.Fatal(err)
	}
	timestamp, _ := time.Parse(ts, ts)
	s.addAssessments(tx, assess, timestamp, 1)
	tx.Commit()

	req := httptest.NewRequest("GET", "/export", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, "text/csv", w.HeaderMap.Get("Content-Type"))

	expect := []string{
		`bar,no,test,2006-01-02T15:04:05-07:00`,
		`baz,,test,2006-01-02T15:04:05-07:00`,
		`foo,yes,test,2006-01-02T15:04:05-07:00`,
	}

	assert.Equal(t, expect, strings.Fields(w.Body.String()))
}

func TestUI(t *testing.T) {
	tempdir, err := ioutil.TempDir("", "evidence-test")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempdir)

	uiDir := filepath.Join(tempdir, "ui")
	err = os.MkdirAll(filepath.Join(uiDir, "static"), 0755)
	if err != nil {
		t.Fatal(err)
	}

	hello := "<html>Hello, world!</html>"
	for _, f := range []struct{ name, content string }{
		{"index.html", hello},
		{"static/empty", ""},
		{"../forbidden", "I should not be seen"},
	} {
		err = ioutil.WriteFile(filepath.Join(uiDir, f.name),
			[]byte(f.content), 0644)
		if err != nil {
			t.Fatal(err)
		}
	}

	r := httprouter.New()
	s := newServer(nil, "", "", r)
	s.uiDir = uiDir

	req := httptest.NewRequest("GET", "/ui/", nil)
	w := httptest.NewRecorder()
	w.Body = new(bytes.Buffer)
	r.ServeHTTP(w, req)
	resp := w.Result()

	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, hello, w.Body.String())

	req = httptest.NewRequest("GET", "/ui/static/empty", nil)
	w = httptest.NewRecorder()
	w.Body = new(bytes.Buffer)
	r.ServeHTTP(w, req)
	resp = w.Result()

	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, "", w.Body.String())

	req = httptest.NewRequest("GET", "/ui/static/nonexistent", nil)
	w = httptest.NewRecorder()
	w.Body = new(bytes.Buffer)
	r.ServeHTTP(w, req)
	resp = w.Result()

	assert.Equal(t, http.StatusNotFound, resp.StatusCode)

	// A file outside ui/ should not be read, even if it exists.
	// We should get index.html instead.
	req = httptest.NewRequest("GET", "/ui/../forbidden", nil)
	w = httptest.NewRecorder()
	w.Body = new(bytes.Buffer)
	r.ServeHTTP(w, req)
	resp = w.Result()

	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
}

// NewDatabase creates a new in-memory SQLite database with the given users.
func newDatabase(t *testing.T, users ...string) *sql.DB {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatal(err)
	}

	schema, err := ioutil.ReadFile("schema.sql")
	if err == nil {
		_, err = db.Exec(string(schema))
	}
	if err != nil {
		t.Fatalf("SQL: %v", err)
	}

	for _, user := range users {
		_, err := db.Exec(`INSERT INTO users (username) VALUES (?)`, user)
		if err != nil {
			t.Fatalf("SQL: %v", err)
		}
	}

	return db
}
