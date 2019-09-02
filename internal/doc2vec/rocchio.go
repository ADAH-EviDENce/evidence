// Rocchio relevance feedback algorithm in normalized doc2vec space.

package doc2vec

import (
	"context"

	"github.com/knaw-huc/evidence-gui/internal/vectors"
)

func (idx *Index) Rocchio(ctx context.Context, qid string, offset, size int,
	pos, neg []string, wq, wpos, wneg float32) ([]string, error) {

	q := idx.docs[qid].vector
	q = idx.expand(q, pos, neg, wq, wpos, wneg)
	// doc gets the query's id for filtering in idx.nearest.
	doc := &Document{qid, q}

	exclude := make(map[string]struct{})
	for _, id := range pos {
		exclude[id] = struct{}{}
	}
	for _, id := range neg {
		exclude[id] = struct{}{}
	}

	return idx.nearest(ctx, doc, offset, size, exclude)
}

func (idx *Index) expand(q vectors.Vector, pos, neg []string,
	wq, wpos, wneg float32) vectors.Vector {

	p := make(vectors.Vector, len(q))
	n := make(vectors.Vector, len(q))
	r := make(vectors.Vector, len(q))

	r.Add(q)
	r.Mul(wq)

	for _, id := range pos {
		p.Add(idx.docs[id].vector)
	}
	if len(pos) > 0 {
		p.Mul(wpos / float32(len(pos)))
		r.Add(p)
	}

	for _, id := range neg {
		n.Add(idx.docs[id].vector)
	}
	if len(neg) > 0 {
		n.Mul(-wneg / float32(len(neg)))
		r.Add(n)
	}

	return r.Normalize()
}
