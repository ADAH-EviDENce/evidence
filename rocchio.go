package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
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

	// Default values taken from Manning, Raghavan and Schütze,
	// https://nlp.stanford.edu/IR-book/html/htmledition/the-rocchio71-algorithm-1.html
	var queryWeight, posWeight, negWeight float64
	queryWeight, err := formWeight(r, "queryweight", 1)
	if err == nil {
		posWeight, err = formWeight(r, "posweight", .75)
	}
	if err == nil {
		negWeight, err = formWeight(r, "negweight", .15)
	}
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

	es, err := elastic.NewSimpleClient(elastic.SetURL(s.elasticEndpoint))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	ids, npos, err := s.getAssessed()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	q := elastic.NewBoolQuery().
		Must(elastic.NewMoreLikeThisQuery().Ids(id).Boost(queryWeight))
	expand, err := s.rocchioExpand(r.Context(), es, q, ids, npos, posWeight, negWeight)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	q.Should(expand)

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

// Gets the identifiers of assessed snippets from the database.
func (s *server) getAssessed() (ids []string, npos int, err error) {
	tx, err := s.db.Begin()
	if err != nil {
		return
	}
	defer tx.Commit()

	ids, err = s.byAssessment(tx, true, nil)
	if err != nil {
		return
	}
	npos = len(ids)
	ids, err = s.byAssessment(tx, false, ids)
	if err != nil {
		return
	}

	return
}

func (s *server) byAssessment(tx *sql.Tx, value bool, buf []string) (ids []string, err error) {
	rows, err := tx.Query(`SELECT id FROM assessments WHERE relevant = ?`, value)
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

	for _, doc := range docs {
		for field, fieldinfo := range doc.TermVectors {
			for term, _ := range fieldinfo.Terms {
				// TODO Take into account DocFreq? What does the Score field contain?
				q.Should(elastic.NewTermQuery(field, term))
			}
		}
	}

	return q
}
