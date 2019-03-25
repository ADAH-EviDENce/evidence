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

	es, q, err := s.rocchioMoreLikeThis(r.Context(), id, queryWeight, posWeight, negWeight)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	search := es.Search("snippets").Type("snippet").Query(q)
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

// Rocchio relevance feedback algorithm. This performs a MoreLikeThis-style
// query based on the document with id qid, weights a (query), b (positive
// expansion) and c (negative expansion).
func (s *server) rocchioMoreLikeThis(ctx context.Context, qid string, a, b, c float64) (es *elastic.Client, q elastic.Query, err error) {
	tx, err := s.db.Begin()
	if err != nil {
		return nil, nil, err
	}
	defer tx.Commit()

	ids := []string{qid}
	ids, err = s.byAssessment(tx, true, ids)
	if err != nil {
		return
	}
	npos := len(ids)
	ids, err = s.byAssessment(tx, false, ids)
	if err != nil {
		return
	}

	posWeight := b
	if npos > 0 {
		posWeight /= float64(npos)
	}
	negWeight := c
	if len(ids) > npos {
		negWeight /= float64(len(ids) - npos)
	}

	return s.makeRocchioQuery(ctx, ids, npos, a, posWeight, negWeight)
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

// MakeRocchioQuery constructs a query based on the positive and negative
// samples (document identifers) ids[:npos] and ids[npos:],
// with the given weights.
func (s *server) makeRocchioQuery(ctx context.Context, ids []string, npos int, queryWeight, posWeight, negWeight float64) (*elastic.Client, elastic.Query, error) {
	es, err := elastic.NewSimpleClient(elastic.SetURL(s.elasticEndpoint))

	mtv := es.MultiTermVectors().Index("snippets").Type("snippet")
	mtv.Ids(ids)
	mtv.Fields([]string{"text", "lemma"})
	mtv.Offsets(false)
	mtv.Positions(false)

	resp, err := mtv.Do(ctx)
	if err != nil {
		return nil, nil, err
	}

	type termInField struct{ term, field string }
	terms := make(map[termInField]float64)

	for i, doc := range resp.Docs {
		weight := queryWeight
		if i > 0 {
			weight = posWeight
		}
		if i >= npos+1 {
			weight = -negWeight
		}

		for field, fieldinfo := range doc.TermVectors {
			for term, terminfo := range fieldinfo.Terms {
				// TODO Take into account DocFreq? What does the Score field contain?
				terms[termInField{term, field}] += weight * float64(terminfo.TermFreq)
			}
		}
	}

	q := elastic.NewBoolQuery()
	for t, boost := range terms {
		q.Should(elastic.NewTermQuery(t.field, t.term).Boost(boost))
	}
	return es, q, nil
}
