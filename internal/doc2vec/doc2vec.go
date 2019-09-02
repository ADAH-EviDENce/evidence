// Package doc2vec implements a nearest-neighbor index based on doc2vec.
//
// Training the doc2vec model is done offline by a Python program.
package doc2vec

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"os"
	"strconv"

	"github.com/knaw-huc/evidence-gui/internal/vectors"
	"github.com/knaw-huc/evidence-gui/internal/vp"
)

// A Document is a document id (reference to Elasticsearch)
// combined with its a doc2vec vector.
type Document struct {
	id     string
	vector vectors.Vector
}

// An Index contains doc2vec vectors for documents and allows nearest neighbor
// queries.
type Index struct {
	docs map[string]*Document

	// The actual index structure is a VP-tree using Euclidean distance.
	// Minimizing Euclidean distance is equivalent to maximizing cosine
	// similarity.
	tree *vp.Tree
}

// The elements of docs should be of actual type *Document.
func NewIndex(docs []interface{}) (*Index, error) {
	byid := make(map[string]*Document)

	for _, elem := range docs {
		doc := elem.(*Document)
		byid[doc.id] = doc
	}

	tree, err := vp.New(nil, distance, docs)
	if err != nil {
		return nil, err
	}

	return &Index{docs: byid, tree: tree}, nil
}

func NewIndexFromCSV(filename string) (*Index, error) {
	f, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var docs []interface{}
	r := csv.NewReader(f)
loop:
	for {
		record, err := r.Read()
		switch err {
		case nil:
		case io.EOF:
			break loop
		default:
			return nil, err
		}

		vector := make(vectors.Vector, 0)
		for _, f := range record[1:] {
			x, err := strconv.ParseFloat(f, 32)
			if err != nil {
				return nil, err
			}
			vector = append(vector, float32(x))
		}

		docs = append(docs, &Document{
			id:     record[0],
			vector: vector.Normalize(),
		})
	}

	return NewIndex(docs)
}

// Performs a nearest-neighbors query for the document with id qid.
// The results at offset through offset+size are returned.
func (idx *Index) Nearest(ctx context.Context, qid string, offset, size int, exclude map[string]struct{}) ([]string, error) {
	doc, ok := idx.docs[qid]
	if !ok {
		return nil, fmt.Errorf("no document with id %q", qid)
	}

	pred := func(x interface{}) bool {
		id := x.(*Document).id
		_, ok := exclude[id]
		return !ok && id != qid
	}

	near, err := idx.tree.Search(ctx, doc, size+offset, math.Inf(+1), pred)
	if err != nil || len(near) == 0 {
		return nil, err
	}

	offset = min(offset, len(near))
	end := min(offset+size, len(near))

	ids := make([]string, 0, end-offset)
	for _, n := range near[offset:end] {
		ids = append(ids, n.Point.(*Document).id)
	}

	return ids, nil
}

// Euclidean distance between the vectors d and q (document and query, but
// the order is irrelevant).
func distance(d, q interface{}) float64 {
	return vectors.Distance(d.(*Document).vector, q.(*Document).vector)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
