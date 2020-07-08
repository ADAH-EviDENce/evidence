package vp

import (
	"container/heap"
	"context"
	"sort"
)

type Predicate func(interface{}) bool

type Result struct {
	Dist  float64
	Point interface{}
}

// Search performs a generalized nearest neighbors search.
// It returns the k points within t that are nearest to p, after eliminating
// all points farther than maxDist and all points for which pred returns false.
//
// The returned points are sorted by distance from p, so the nearest neighbor
// is at index 0.
//
// To do a regular nearest neighbors search, set maxDist to math.Inf(+1).
//
// Search returns an error if and only if the context ctx expires.
// If ctx is nil, context.Background() is used instead.
// If pred is nil, a function that always returns true is used instead.
func (t *Tree) Search(ctx context.Context, p interface{}, k int, maxDist float64, pred Predicate) ([]Result, error) {
	if pred == nil {
		pred = all
	}
	if ctx == nil {
		ctx = context.Background()
	}
	s := searcher{
		ctx:    ctx,
		k:      k,
		query:  p,
		pred:   pred,
		radius: maxDist,
		result: make([]Result, 0, k),
		t:      t,
	}
	s.search(t.root)
	if s.err != nil {
		return nil, s.err
	}
	sort.Sort(sort.Reverse(byDistance(s.result)))
	return s.result, nil
}

type searcher struct {
	ctx    context.Context
	err    error
	k      int
	pred   Predicate
	query  interface{}
	radius float64
	result byDistance
	t      *Tree
}

func (s *searcher) search(n *node) {
	if n == nil {
		return
	}
	select {
	case <-s.ctx.Done():
		s.err = s.ctx.Err()
		return
	default:
	}

	d := s.t.metric(s.query, n.center)
	if d <= s.radius && s.pred(n.center) {
		if len(s.result) < s.k {
			heap.Push(&s.result, Result{Point: n.center, Dist: d})
		} else if d < s.result[0].Dist {
			s.result[0] = Result{Point: n.center, Dist: d}
			heap.Fix(&s.result, 0)
			s.radius = s.result[0].Dist
		}
	}

	if d < n.radius {
		s.search(n.inside)
		if d+s.radius >= n.radius {
			s.search(n.outside)
		}
	} else {
		s.search(n.outside)
		if d-s.radius <= n.radius {
			s.search(n.inside)
		}
	}
}

// Default predicate for searchers.
func all(interface{}) bool { return true }

// byDistance sorts Results in descending order of Dist.
type byDistance []Result

func (r byDistance) Len() int            { return len(r) }
func (r byDistance) Less(i, j int) bool  { return r[i].Dist > r[j].Dist }
func (r *byDistance) Pop() interface{}   { panic("use heap.Fix, not heap.Pop") }
func (r *byDistance) Push(x interface{}) { *r = append(*r, x.(Result)) }
func (r byDistance) Swap(i, j int)       { r[i], r[j] = r[j], r[i] }
