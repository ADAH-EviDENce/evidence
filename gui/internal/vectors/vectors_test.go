package vectors

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDistance(t *testing.T) {
	x := Vector([]float32{0, 2, 4, 8}).Normalize()
	y := Vector([]float32{1, 3, 5, 7}).Normalize()
	assert.InEpsilon(t, 0.218218, Distance(x, y), 1e-6)

	x = Vector([]float32{.01, -.021, .003, .00015}).Normalize()
	assert.Equal(t, float64(0), Distance(x, x))
}

func TestDot(t *testing.T) {
	x := []float32{0, 2, 4, 8}
	y := []float32{1, 3, 5, 7}
	assert.InEpsilon(t, 82, dot(x, y), 1e-15)
}

func TestZeroNorm(t *testing.T) {
	x := make(Vector, 1)
	assert.Equal(t, float32(0), x.Normalize()[0])
}
