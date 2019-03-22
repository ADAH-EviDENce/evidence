// Derived from http://vigna.di.unimi.it/xorshift/xoroshiro128plus.c:
// Written in 2016 by David Blackman and Sebastiano Vigna (vigna@acm.org)
//
// To the extent possible under law, the author has dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// See <http://creativecommons.org/publicdomain/zero/1.0/>.

package tinyrng

// The following comment is lifted from the original C code.
/* This is the successor to xorshift128+. It is the fastest full-period
   generator passing BigCrush without systematic failures, but due to the
   relatively short period it is acceptable only for applications with a
   mild amount of parallelism; otherwise, use a xorshift1024* generator.

   Beside passing BigCrush, this generator passes the PractRand test suite
   up to (and included) 16TB, with the exception of binary rank tests,
   which fail due to the lowest bit being an LFSR; all other bits pass all
   tests. We suggest to use a sign test to extract a random Boolean value.

   Note that the generator uses a simulated rotate operation, which most C
   compilers will turn into a single instruction. In Java, you can use
   Long.rotateLeft(). In languages that do not make low-level rotation
   instructions accessible xorshift128+ could be faster.

   The state must be seeded so that it is not everywhere zero. If you have
   a 64-bit seed, we suggest to seed a splitmix64 generator and use its
   output to fill s. */

// Xoroshiro128+ random number generator.
//
// This RNG has exactly 128 bits of state and can be embedded in structs.
//
// Due to the relatively short period, it is acceptable only for applications
// with a mild amount of parallelism.
type Xoroshiro128 struct {
	// RNG state. This can be set by the client, but they must make sure
	// to not set both values to zero. The Seed method takes care of this.
	S [2]uint64
}

func rotl(x uint64, k uint) uint64 {
	return (x << k) | (x >> (64 - k))
}

func (x *Xoroshiro128) Int63() int64 {
	return int64(x.Uint64() &^ (1 << 63))
}

// Seed sets the random state of x using seed and a SplitMix64 generator.
func (x *Xoroshiro128) Seed(seed int64) {
	s := SplitMix64(seed)
retry:
	s1, s2 := s.Uint64(), s.Uint64()
	if s1 == 0 && s2 == 0 {
		goto retry
	}
	x.S[0], x.S[1] = s1, s2
}

// Seed2 seeds x from two 64-bit random numbers, that may both be zero.
func (x *Xoroshiro128) Seed2(s1, s2 uint64) {
	if s1 == 0 && s2 == 0 {
		sm := SplitMix64(0)
		s1 = sm.Uint64()
	}
	x.S[0], x.S[1] = s1, s2
}

func (x *Xoroshiro128) Uint64() uint64 {
	s0, s1 := x.S[0], x.S[1]
	result := s0 + s1

	s1 ^= s0
	x.S[0] = rotl(s0, 55) ^ s1 ^ (s1 << 14)
	x.S[1] = rotl(s1, 36)

	return result
}

// Jump is equivalent to 1<<64 calls to Uint64.
//
// It can be used to generate 1<<64 non-overlapping subsequences for parallel
// computations.
func (x *Xoroshiro128) Jump() {
	jump := [...]uint64{0xbeac0467eba5facb, 0xd86b048b86aa9922}
	var s0, s1 uint64

	for i := 0; i < len(jump); i++ {
		for b := uint(0); b < 64; b++ {
			if jump[i]&(1<<b) != 0 {
				s0 ^= x.S[0]
				s1 ^= x.S[1]
			}
			x.Uint64()
		}
	}

	x.S[0], x.S[1] = s0, s1
}
