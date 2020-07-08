package tinyrng

// Derived from http://vigna.di.unimi.it/xorshift/splitmix64.c:
/*  Written in 2015 by Sebastiano Vigna (vigna@acm.org)

To the extent possible under law, the author has dedicated all copyright
and related and neighboring rights to this software to the public domain
worldwide. This software is distributed without any warranty.

See <http://creativecommons.org/publicdomain/zero/1.0/>. */

// SplitMix64 random number generator.
//
// A SplitMix64 is an RNG that is so small that it can be embedded in a struct.
// It may be seeded by setting it to a random value derived from another RNG.
type SplitMix64 uint64

// Int63 returns 63 random bits as a 64-bit signed integer.
func (s *SplitMix64) Int63() int64 {
	return int64(s.Uint64() &^ (1 << 63))
}

func (s *SplitMix64) Seed(seed int64) { *s = SplitMix64(seed) }

// Uint64 returns 64 random bits and updates the state of s.
func (s *SplitMix64) Uint64() uint64 {
	*s += 0x9e3779b97f4a7c15
	z := uint64(*s)
	z = (z ^ (z >> 30)) * 0xbf58476d1ce4e5b9
	z = (z ^ (z >> 27)) * 0x94d049bb133111eb
	return z ^ (z >> 31)
}
