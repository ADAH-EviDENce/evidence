package doc2vec

import (
	"context"
	"fmt"
	"math/rand"
	"testing"

	"github.com/knaw-huc/evidence-gui/internal/vectors"
	"github.com/stretchr/testify/assert"
)

func TestQuery(t *testing.T) {
	docs, idx := newIndex(t)

	q := docs[14].(*Document).id
	const size = 10
	near, err := idx.NearestToDoc(context.TODO(), q, 0, size, nil)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, size, len(near))

	for _, n := range near {
		assert.NotEqual(t, q, n)
	}
}

func TestScroll(t *testing.T) {
	docs, idx := newIndex(t)

	var (
		q    = docs[14].(*Document).id
		seen = make(map[string]struct{})
		size = 6
	)
	for offset := 0; offset < len(docs); offset += size {
		near, err := idx.NearestToDoc(context.TODO(), q, offset, size, nil)
		if err != nil {
			t.Fatal(err)
		}

		expectSize := size
		if offset+size > len(docs) {
			// -1 because the query id is filtered out.
			expectSize = len(docs) - offset - 1
		}
		assert.Equal(t, expectSize, len(near))
		t.Log(near)

		for _, id := range near {
			seen[id] = struct{}{}
		}
	}

	assert.Equal(t, len(docs)-1, len(seen))
	assert.NotContains(t, seen, q)
}

func newIndex(t *testing.T) (docs []interface{}, idx *Index) {
	docs = makeDocs()
	idx, err := NewIndex(docs)
	if err != nil {
		t.Fatal(err)
	}
	return
}

func makeDocs() []interface{} {
	r := rand.New(rand.NewSource(42))

	var docs []interface{}
	v := make(vectors.Vector, 15)

	for i := 0; i < 100; i++ {
		for j := range v {
			v[j] = float32(r.NormFloat64())
		}

		docs = append(docs, &Document{
			id:     fmt.Sprintf("doc%d", i),
			vector: v.Normalize(),
		})
	}

	return docs
}
