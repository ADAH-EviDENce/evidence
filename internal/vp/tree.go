// Package vp provides vantage point trees (VP-trees), a spatial index
// structure.
package vp

// A Metric is a function m that satisfies the metric axioms.
//
// It is assumed that a metric can be called by multiple goroutines
// concurrently.
type Metric func(a, b interface{}) float64

// A Tree is an index structure for strings that allows nearest-neighbor
// and radius queries.
type Tree struct {
	metric Metric
	nelem  int
	root   *node
}

type node struct {
	center  interface{}
	inside  *node
	outside *node
	radius  float64
}

// Do calls f on each item in the tree t, in some unspecified order,
// until f returns false.
func (t *Tree) Do(f func(interface{}) bool) {
	t.root.do(f)
}

func (n *node) do(f func(interface{}) bool) bool {
	for n != nil {
		if !f(n.center) {
			return false
		}
		if !n.inside.do(f) {
			return false
		}
		n = n.outside
	}
	return true
}

// Len reports the number of elements in t.
func (t *Tree) Len() int {
	return t.root.len()
}

func (n *node) len() int {
	num := 0
	for n != nil {
		num += 1 + n.inside.len()
		n = n.outside
	}
	return num
}
