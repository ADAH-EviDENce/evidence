// Package vp provides vantage point trees (VP-trees), a spatial index
// structure.
package vp

import (
	"context"
	"math"
	"math/rand"

	"github.com/knaw-huc/evidence-gui/internal/tinyrng"
)

// New constructs a Tree from the points, using the metric m.
//
// Construction may be stopped by canceling ctx,
// in which case ctx.Err() is returned.
// Otherwise, err will be nil. If ctx is nil, context.Background() is used.
func New(ctx context.Context, m Metric, points []interface{}) (t *Tree, err error) {
	return NewFromSeed(ctx, m, points, rand.Int63())
}

// NewFrom is like New, but with an explicit random seed.
func NewFromSeed(ctx context.Context, m Metric, points []interface{}, seed int64) (t *Tree, err error) {
	if ctx == nil {
		ctx = context.Background()
	}
	done := ctx.Done()

	var pointsDists []pointDist
	for _, p := range points {
		pointsDists = append(pointsDists, pointDist{p: p})
	}

	b := builder{
		done:   done,
		metric: m,
		points: pointsDists,
	}
	b.rng.Seed(seed)

	root := b.build()
	select {
	case <-done:
		err = ctx.Err()
	default:
		t = &Tree{
			metric: m,
			nelem:  len(points),
			root:   root,
		}
	}
	return
}

type builder struct {
	done   <-chan struct{}
	metric Metric
	points []pointDist          // Points, with scratch space for distances.
	rng    tinyrng.Xoroshiro128 // Splittable RNG.
}

type pointDist struct {
	p interface{}
	d float64
}

func (b *builder) build() *node {
	select {
	case <-b.done:
		return nil // don't care; New is going to ignore the result
	default:
	}

	switch len(b.points) {
	case 0:
		return nil
	case 1:
		return singleton(b.points[0].p, &node{})
	case 2:
		return b.build2()
	case 3:
		return b.build3()
	}

	// Shuffle for both selectVantage and selectMedian.
	rand.New(&b.rng).Shuffle(len(b.points), b.swap)

	vantage := b.selectVantage()
	// XXX the following loop can be done in parallel.
	for i := range b.points {
		b.points[i].d = b.metric(vantage, b.points[i].p)
	}
	medianIdx := b.selectMedian()
	medianDist := b.points[medianIdx].d

	left, right := b, b.split(medianIdx)
	inside := make(chan *node, 1)
	go func() {
		inside <- left.build()
	}()

	return &node{
		center:  vantage,
		inside:  <-inside,
		outside: right.build(),
		radius:  medianDist,
	}
}

// Base case with two points.
func (b *builder) build2() *node {
	vantage, other := b.points[0].p, b.points[1].p

	var nodes [2]node
	nodes[0] = node{
		center: vantage,
		radius: b.metric(vantage, other),
		inside: singleton(other, &nodes[1]),
	}
	return &nodes[0]
}

// Base case with three points.
func (b *builder) build3() *node {
	vantage := b.selectVantage()

	if b.points[0].d > b.points[1].d {
		b.swap(0, 1)
	}

	var nodes [3]node
	nodes[0] = node{
		center:  vantage,
		radius:  (b.points[0].d + b.points[1].d) / 2,
		inside:  singleton(b.points[0].p, &nodes[1]),
		outside: singleton(b.points[1].p, &nodes[2]),
	}
	return &nodes[0]
}

// Construct a singleton tree containing point p in n.
func singleton(p interface{}, n *node) *node {
	*n = node{center: p, radius: math.NaN()}
	return n
}

// Splits a builder in two, dividing the points at index i.
func (b *builder) split(i int) *builder {
	var b2 builder
	b2 = *b
	b2.rng.Jump()

	b.points, b2.points = b.points[:i], b.points[i:]

	return &b2
}

// Quickselect. Points has been shuffled before entry,
// so no need to bother with fancy pivoting.
func (b *builder) selectMedian() int {
	median := len(b.points) / 2
loop:
	for lo, hi := 0, len(b.points)-1; hi > lo; {
		pivot := b.partition(lo, hi)
		switch {
		case median == pivot:
			break loop
		case median < pivot:
			hi = pivot - 1
		default:
			lo = pivot + 1
		}
	}
	return median
}

// Lomuto partition. Partitions b.dist[lo:hi+1] and b.points[lo:hi+1] around
// a pivot value and returns the index of the pivot.
func (b *builder) partition(lo, hi int) int {
	pivot := b.points[hi].d

	i := lo
	for j := lo; j < hi; j++ {
		if b.points[j].d <= pivot {
			b.swap(i, j)
			i++
		}
	}

	b.swap(i, hi)
	return i
}

func (b *builder) swap(i, j int) {
	b.points[i], b.points[j] = b.points[j], b.points[i]
}

// Selects, removes and returns a vantage point from b.points.
// b.points must be shuffled before entry.
func (b *builder) selectVantage() interface{} {
	// For small numbers of points, compute the exact best vantage point.
	sample := b.points
	if len(b.points) >= 6 {
		// Otherwise, take a sample of O(√n) points and select the best point
		// in the sample as the vantage point.
		// The square root makes the loop below run in linear time.
		size := int(math.Sqrt(float64(len(b.points))))
		sample = sample[:size]
	}

	best := -1
	bestSpread := math.Inf(-1)

	for i := range sample {
		b.swap(0, i)
		candidate := sample[0].p

		rest := sample[1:]
		for j := range rest {
			rest[j].d = b.metric(candidate, rest[j].p)
		}
		mean := average(rest)
		spread := meanabsdev(rest, mean)
		if spread > bestSpread {
			best, bestSpread = i, spread
		}
		b.swap(0, i)
	}

	b.swap(best, 0)
	vantage := b.points[0].p
	b.points = b.points[1:]
	return vantage
}

// Mean of a[...].d.
func average(a []pointDist) float64 {
	return sum(a) / float64(len(a))
}

func sum(a []pointDist) float64 {
	// Recursive sum for stability: O(log n) roundoff error vs. linear for a
	// straight loop.
	switch n := len(a); n {
	case 0:
		return 0
	case 1:
		return a[0].d
	case 2:
		return a[0].d + a[1].d
	default:
		return sum(a[:n/2]) + sum(a[n/2:])
	}
}

// Mean absolute deviation of a[...].d given its mean.
func meanabsdev(a []pointDist, mean float64) float64 {
	return sumabsdev(a, mean) / float64(len(a))
}

// Sum of absolute deviations of a[...] from m.
func sumabsdev(a []pointDist, m float64) float64 {
	// See comment in sum function above.
	switch n := len(a); n {
	case 0:
		return 0
	case 1:
		return math.Abs(a[0].d - m)
	default:
		return sumabsdev(a[:n/2], m) + sumabsdev(a[n/2:], m)
	}
}
