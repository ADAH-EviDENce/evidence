package main

import (
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

	"github.com/julienschmidt/httprouter"
	"github.com/stretchr/testify/assert"
)

func TestAssessments(t *testing.T) {
	es := mockElastic()
	defer es.Close()

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
	assessDB{db: db, elasticEndpoint: es.URL}.installHandler(r)

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

func TestESProxy(t *testing.T) {
	es := mockElastic()
	defer es.Close()

	r := httprouter.New()
	assessDB{elasticEndpoint: es.URL}.installHandler(r)

	req := httptest.NewRequest("GET", "/es/snippets/snippet/_mget", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	// We care about getting through to the proxied server,
	// not about its handling of incorrect requests.
	assert.NotEqual(t, http.StatusNotFound, w.Result().StatusCode)
}

func mockElastic() *httptest.Server {
	r := httprouter.New()
	r.GET("/snippets/snippet/_mget", mget)

	return httptest.NewServer(r)
}

func mget(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	docs := make(map[string]struct{})
	for _, s := range []string{"foo", "bar", "baz", "quux"} {
		docs[s] = struct{}{}
	}

	var m map[string][]struct {
		Id string `json:"_id"`
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
