package tinyrng

import "math/rand"

var (
	_ rand.Source = (*SplitMix64)(nil)
	_ rand.Source = (*Xoroshiro128)(nil)
)
