---
title: 1208F - Bits And Pieces
category: notes
date: 2026-02-24
tags: [bitmasks, dp]
---

### [1208F - Bits And Pieces](https://codeforces.com/problemset/problem/1208/F)

Fix $a[i]$, then we can enumerate a prefix of off-bits in $a[i]$. The remaining task is to find the two right most positions that contain the prefix we enumerate.

This can be solved by SOS DP. Let $f[s]$ and $g[s]$ be the first and second right most positions that contain $s$.

```cpp
#include <cmath>
#include <vector>
#include <iostream>
#include <algorithm>

void insert(int &first_max, int &second_max, int val) {
	if (val > first_max) {
		second_max = first_max;
		first_max = val;
	} else if (val < first_max && val > second_max) {
		second_max = val;
	}
}

int main() {
	std::cin.tie(nullptr)->sync_with_stdio(0);
	int n;
	std::cin >> n;
	// fix a[i]
	// enumerate prefix off-bits of a[i]
	// f[s] = rightmost a[i] s.t. s \in a[i]
	// g[s] = second rightmost
	std::vector<int> a(n);
	for (auto &x : a) std::cin >> x;
	int max_val = *std::max_element(a.begin(), a.end());
	int max_bit = std::log2(max_val) + 1;

	std::vector<int> f(1 << max_bit, -1), g(1 << max_bit, -1);
	for (int i = n; i--;) {
		int x = a[i];
		if (f[x] == -1) f[x] = i;
		else if (g[x] == -1) g[x] = i;
	}
	// g[t] < f[t]
	// f[t] <- f[s]
	for (int i = 0; i < max_bit; ++i) {
		for (int s = 0; s < (1 << max_bit); ++s) {
			if (s >> i & 1) {
				int t = s ^ (1 << i);
				insert(f[t], g[t], f[s]);
				insert(f[t], g[t], g[s]);
			}
		}
	}
	int ans = 0;
	for (int i = 0; i < n; ++i) {
		int complement = ((1 << max_bit) - 1) ^ a[i];
		int current = 0;
		for (int k = max_bit; k--;) {
			if (complement >> k &  1) {
				int t = current | (1 << k);
				if (g[t] > i)
					current = t;
			}
		}
		ans = std::max(ans, a[i] | current);
	}
	std::cout << ans << "\n";
}

```

# [PE 987 Straight Eight](https://projecteuler.net/problem=987)

Spent a whole morning on this...

In a deck of poker cards, we have $14$ ranks and $4$ suits. By Pigeonhole, cards with rank $5$ or $10$ are bound to be used up. Let us use them as "anchors", meaning every straight corresponds to one of the $8$ cards with rank $5$ or $10$. Let $(f_1, \dots, f_8)$ denote the eight straights.

Let us use the Inclusion-Exclusion principle. We only need to appoint some of the straights to be straight flushes, and compute the number of ways to arrange the rest straights.

One observation is, if a straight is anchored by a $5$, there are at maximum $5$ different **shapes** of it, namely $(1,2,3,4,5),(2,3,4,5,6),\dots(5,6,7,8,9)$ and so holds true for a straight anchored by a $10$.

We enumerate the **shapes** of all $8$ straights, there are $5^8$ combinations.

```python
def permutate(n, k):
    res = 1
    for i in range(k):
        res *= n-i
    return res

def calc(f, mask):
    # @f = the first rank of a flush
    # Bits in @mask: set if it is a flush
    k = [4]*13
    c = [0]*13
    for idx, i in enumerate(f):
        if mask>>idx&1:
            for j in range(i, i+5):
                k[j%13] -= 1
        else:
            for j in range(i, i+5):
                c[j%13] += 1
    c[4] = c[9] = k[4] = k[9] = 0 # 4, 9 are taken as "anchors", so will not contribute to combination calculations
    res = 1
    for i in range(13):
        res *= permutate(k[i], c[i])
    return res

def dfs(f):
    if len(f) == 8:
        res = 0
        for mask in range(2**8):
            for i in range(4):
                if (mask>>i&1) and (mask>>(i+4)&1) and (f[i]+4 >= f[i+4] or (f[i] == 0 and f[i+4] == 9)): # if two flushes overlap
                    break
            else: # if for-loop ends naturally
                sgn = -1 if (mask.bit_count())%2 else 1
                res += calc(f, mask)*sgn
        return res
    else:
        start = 0
        res = 0
        if len(f) >= 4:
            start = 5
        for p in range(start, start+5):
            res += dfs(f+[p])
        return res

print(dfs([]))
```

