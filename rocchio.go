package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sort"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/olivere/elastic"
)

// Rocchio relevance feedback algorithm. This performs a MoreLikeThis-style
// query based on the document with id qid, weights a (query), b (positive
// expansion) and c (negative expansion).
func (s *server) rocchio(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := ps.ByName("id")
	if !s.validateId(w, r, []string{id}) {
		return
	}

	r.ParseForm()

	queryWeight, posWeight, negWeight, err := rocchioWeights(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	offset := intValue(w, r.Form, "from", 0)
	if offset == -1 {
		return
	}
	size := intValue(w, r.Form, "size", 10)
	if size == -1 {
		return
	}

	es, err := elastic.NewSimpleClient(elastic.SetURL(s.elasticEndpoint),
		elastic.SetHttpClient(&loggingClient))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	ids, npos, err := s.getAssessed("")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	q := elastic.NewBoolQuery().
		Must(elastic.NewMoreLikeThisQuery().Ids(id).Boost(queryWeight))

	if len(ids) > 0 {
		expand, err := s.rocchioExpand(r.Context(), es, q, ids, npos, posWeight, negWeight)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		q.Should(expand)
	}

	// The docId is used to exclude snippets. Expected usage is to pass the
	// document id that corresponds to the requested snippet.
	docId := r.Form.Get("docId")
	if docId != "" {
		q.MustNot(elastic.NewTermQuery("document", docId))
	}

	search := es.Search("snippets").Type("snippet").From(offset).Size(size).Query(q)
	result, err := search.Do(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(result)
}

// Parses Rocchio query, positive and negative weights from r.
// They default to 1, .75 and .15 when not specified; these are the values
// recommended by Manning, Raghavan and Schütze,
// https://nlp.stanford.edu/IR-book/html/htmledition/the-rocchio71-algorithm-1.html
func rocchioWeights(r *http.Request) (wq, wpos, wneg float64, err error) {
	wq, err = formWeight(r, "queryweight", 1)
	if err == nil {
		wpos, err = formWeight(r, "posweight", .75)
	}
	if err == nil {
		wneg, err = formWeight(r, "negweight", .15)
	}
	return
}

var loggingClient http.Client = *http.DefaultClient

func loggingTransport(r *http.Request) (*http.Response, error) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("cannot read Body from HTTP request to ES: %v", err)
		return nil, err
	}
	log.Printf("HTTP request to Elasticsearch: %s to %s with body %q",
		r.Method, r.URL, body)
	r.Body = ioutil.NopCloser(bytes.NewReader(body))
	return http.DefaultTransport.RoundTrip(r)
}

type functionRoundTripper func(*http.Request) (*http.Response, error)

func (f functionRoundTripper) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }

func init() {
	loggingClient.Transport = functionRoundTripper(loggingTransport)
}

func formWeight(r *http.Request, name string, def float64) (float64, error) {
	formValue := r.Form[name]
	switch len(formValue) {
	case 0:
		return def, nil
	case 1:
		return strconv.ParseFloat(formValue[0], 64)
	default:
		return -1, fmt.Errorf("rocchio: multiple values given for %q", name)
	}
}

// Gets the identifiers of assessed snippets for some user from the database.
//
// If the username is "", all assessed snippets are returned.
func (s *server) getAssessed(username string) (ids []string, npos int, err error) {
	tx, err := s.db.Begin()
	if err != nil {
		return
	}
	defer tx.Commit()

	ids, err = s.byAssessment(tx, username, true, nil)
	if err != nil {
		return
	}
	npos = len(ids)
	ids, err = s.byAssessment(tx, username, false, ids)
	if err != nil {
		return
	}

	return
}

func (s *server) byAssessment(tx *sql.Tx, username string, value bool,
	buf []string) (ids []string, err error) {

	var rows *sql.Rows
	if username == "" {
		rows, err = tx.Query(`SELECT id FROM assessments WHERE relevant = ?`, value)
	} else {
		rows, err = tx.Query(
			`SELECT id FROM assessments JOIN users USING (userid) WHERE relevant = ? AND username = ?`,
			value, username)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	ids = buf
	for rows.Next() {
		ids = append(ids, "")
		err = rows.Scan(&ids[len(ids)-1])
		if err != nil {
			return
		}
	}
	err = rows.Err()
	return
}

// Rocchio expansion of the query q based on terms in the positive and negative
// samples (document identifers) ids[:npos] and ids[npos:], with the given weights.
func (s *server) rocchioExpand(ctx context.Context, es *elastic.Client, q elastic.Query,
	ids []string, npos int, posWeight, negWeight float64) (eq elastic.Query, err error) {

	mtv := es.MultiTermVectors().Index("snippets").Type("snippet")
	mtv.Ids(ids)
	mtv.Fields([]string{"text", "lemma"})
	mtv.Offsets(false)
	mtv.Positions(false)

	resp, err := mtv.Do(ctx)
	if err != nil {
		return
	}

	eq = elastic.NewBoostingQuery().
		Positive(termsQuery(resp.Docs[:npos])).Boost(posWeight).
		Negative(termsQuery(resp.Docs[npos:])).NegativeBoost(negWeight)
	return
}

func termsQuery(docs []*elastic.TermvectorsResponse) *elastic.BoolQuery {
	q := elastic.NewBoolQuery()

	type termInField struct{ term, field string }
	terms := make(map[termInField]int64)

	for _, doc := range docs {
		for field, fieldinfo := range doc.TermVectors {
			for term, terminfo := range fieldinfo.Terms {
				// TODO Take into account DocFreq? What does the Score field contain?
				terms[termInField{term, field}] += terminfo.TermFreq
			}
		}
	}

	type termWithFreq struct {
		termInField
		freq int64
	}
	byFreq := make([]termWithFreq, 0, len(terms))
	for t, freq := range terms {
		byFreq = append(byFreq, termWithFreq{t, freq})
	}
	sort.Slice(byFreq, func(i, j int) bool {
		return byFreq[i].freq > byFreq[j].freq
	})

	// Limited to 25 terms to prevent queries from getting too large.
	// TODO: make this number a parameter.
	const maxTerms = 25
	if len(byFreq) > maxTerms {
		byFreq = byFreq[:maxTerms]
	}
	for _, t := range byFreq {
		q.Should(elastic.NewTermQuery(t.field, t.term).Boost(float64(t.freq)))
	}

	return q
}
