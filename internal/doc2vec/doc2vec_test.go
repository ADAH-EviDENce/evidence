package doc2vec

import (
	"context"
	"fmt"
	"math/rand"
	"testing"

	"github.com/knaw-huc/evidence-gui/internal/vectors"
	"github.com/stretchr/testify/assert"
)

func TestDoc2vec(t *testing.T) {
	r := rand.New(rand.NewSource(42))

	var docs []interface{}
	v := make([]float32, 15)

	for i := 0; i < 100; i++ {
		for j := range v {
			v[j] = float32(r.NormFloat64())
		}

		docs = append(docs, &Document{
			id:     fmt.Sprintf("doc%d", i),
			vector: vectors.NewNormalized(v),
		})
	}

	idx, err := NewIndex(docs)
	if err != nil {
		t.Fatal(err)
	}

	q := docs[14].(*Document).id
	size := 10
	near, err := idx.Nearest(context.TODO(), q, 0, size, nil)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, size, len(near))

	for _, n := range near {
		assert.NotEqual(t, q, n)
	}
}
