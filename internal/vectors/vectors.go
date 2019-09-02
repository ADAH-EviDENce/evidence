// Package vectors implements vector math operations.
package vectors

import "math"

type Vector []float32

// Adds y to x, in-place.
func (x Vector) Add(y Vector) {
	for i := range x {
		x[i] += y[i]
	}
}

// Multiplies x by a, in-place.
func (x Vector) Mul(a float32) {
	for i := range x {
		x[i] *= a
	}
}

// Normalize returns a normalized copy of the vector x.
func (x Vector) Normalize() Vector {
	norm := math.Sqrt(dot(x, x))
	y := make(Vector, len(x))
	copy(y, x)
	y.Mul(float32(1 / norm))
	return y
}

// Euclidean distance between two vectors.
func Distance(x, y Vector) float64 {
	// The square of the Euclidean distance between x and y is
	// ‖x−y‖² = ‖x‖² + ‖y‖² − 2‖x·y‖.
	distSq := dot(x, x) + dot(y, y) - 2*dot(x, y)
	if distSq < 0 {
		// The subtraction may give a negative result due to rounding error.
		return 0
	}
	return math.Sqrt(distSq)
}

// Dot product of x and y.
func dot(x, y []float32) float64 {
	// Recursive computation to get O(log n) roundoff error.
	switch len(x) {
	case 0:
		return 0
	case 1:
		return float64(x[0]) * float64(y[0])
	default:
		n2 := len(x) / 2
		return dot(x[:n2], y[:n2]) + dot(x[n2:], y[n2:])
	}
}
