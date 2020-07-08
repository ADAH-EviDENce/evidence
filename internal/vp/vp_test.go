package vp_test

import (
	"math"
	"math/rand"
	"reflect"
	"sort"
	"testing"

	"github.com/knaw-huc/evidence-gui/internal/vp"
	"github.com/stretchr/testify/assert"
)

func TestDo(t *testing.T) {
	tree, _ := vp.New(nil, lenDist, words)

	mapw := make(map[string]struct{})
	for _, s := range words {
		mapw[s.(string)] = struct{}{}
	}

	mapt := make(map[string]struct{})
	tree.Do(func(s interface{}) bool {
		mapt[s.(string)] = struct{}{}
		return true
	})

	switch {
	case len(mapw) != len(mapt):
		t.Fatalf("%d strings Done, but %d given", len(mapt), len(mapw))
	case !reflect.DeepEqual(mapw, mapt):
		t.Fatal("set of strings from Do != set of string given")
	}
}

func TestSearch(t *testing.T) {
	for i := 2; i < 8; i++ {
		offset := rand.Intn(len(words) - i)
		testSearch(t, words[offset:offset+i])
	}
}

func testSearch(t *testing.T, words []interface{}) {
	nn := make(map[string][]vp.Result)

	for _, q := range words {
		for _, w := range words {
			nn[q.(string)] = append(nn[q.(string)], vp.Result{Point: w, Dist: lenDist(w, q)})
		}

		sort.Slice(nn[q.(string)], func(i, j int) bool {
			x, y := &nn[q.(string)][i], &nn[q.(string)][j]
			return x.Dist < y.Dist || x.Dist == y.Dist && x.Point.(string) < y.Point.(string)
		})
	}

	tree, _ := vp.New(nil, lenDist, words)
	for _, q := range words {
		n, _ := tree.Search(nil, q, len(words), math.Inf(+1), nil)
		sort.Slice(n, func(i, j int) bool {
			x, y := &n[i], &n[j]
			return x.Dist < y.Dist || x.Dist == y.Dist && x.Point.(string) < y.Point.(string)
		})

		assert.Equal(t, nn[q.(string)], n)
	}
}

var (
	queryWords = []interface{}{
		"goroutine", "int", "[]string", "string", "Levenshtein",
		"Damerau", "Wagner", "Fischer", "Kruskal", "Wallis", "XYZZYFLUX",
		"tree", "distance", "interface", "struct", "int64", "assert",
		"filter", "map", "expected", "size", "words", "func", "BK-tree",
		"DamerauLevenshtein", "DeepEquals", "concurrent", "atomic",
		"type", "Go", "builder", "golang", "golang.org", "golang.org/x/text",
		"Python", "C", "C++", "Groovy", "Jython", "John Doe", "Jane Doe",
		"Billybob", "ampersand", "edit distance", "VP-tree", "indel cost",
		"transposition", "macromolecule", "time warping", "0123456789",
		"yes", "no", "but", "and", "for", "to", "stop",
	}
	words []interface{}
)

func init() {
	for _, s1 := range queryWords {
		words = append(words, s1)
		for _, s2 := range queryWords {
			words = append(words, s1.(string)+" -- "+s2.(string))
		}
	}

	// Add some strings that don't occur in queryWords.
	for _, s := range []string{"foo", "bar", "baz", "quux"} {
		words = append(words, s)
	}
}

// The absolute difference in length of two strings is a trivial metric
// that can be used to test and benchmark Search.
func lenDist(a, b interface{}) float64 {
	return math.Abs(float64(len(a.(string)) - len(b.(string))))
}
