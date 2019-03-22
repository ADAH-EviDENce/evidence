// Package vectors implements vector math operations.
package vectors

import "math"

// A Normalized vector has Euclidean norm 1.
type Normalized []float32

func NewNormalized(x []float32) Normalized {
	norm := math.Sqrt(dot(x, x))
	y := make(Normalized, len(x))
	for i := range x {
		y[i] = float32(float64(x[i]) / norm)
	}
	return y
}

// Euclidean distance between normalized vectors.
func Distance(x, y Normalized) float64 {
	// The square of the Euclidean distance between x and y is
	// ‖x−y‖² = ‖x‖² + ‖y‖² − 2‖x·y‖.
	// For normalized vectors x and y, that's ‖x−y‖² = 2 − 2‖x·y‖.
	return math.Sqrt(2 - 2*dot(x, y))
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
