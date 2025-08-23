---
title: Solution -「CF 2125E」Sets of Complementary Sums
date: 2025-08-14
category: notes
tags: [dp]
---

[link.](https://codeforces.com/contest/2125/problem/E)

$$
test
$$

nima [^1].

[^1]: https://codeforces.com/profile/cirnovlove

```cpp
//dp[i+j+1]+=dp[i]
#include <bits/stdc++.h>
using namespace std;

const int MD = 998244353;
const int N = 2e5;

int dp[N + 1];

int solve() {
	int n, x;
	scanf("%d%d", &n, &x);
	long long tmp = (long long) (n + 1) * (n - 1) - (long long) n * (n + 1) / 2;
	//need sum(mx + 1 - ai) <= mx + 1
	//(mx + 1)(n - 1) <= sum(ai)
	//start with 1, 2, ..., n
	//adding 1 to j suffix increases (lhs - rhs) by n - j - 1
	//dp[i] for mx = i, how many sequences s.t. lhs <= rhs
	//manupilate 1, 2, ..., n
	//if initially lhs > rhs, need to add 1 to all ai, denote t as the number needed and start with 1+t, 2+t, ..., n+t
	//dp[n+t] = 1
	//items are suffixes
	//complete knapsack
	//1 2 3    8*2-6
	//3 4 5    6*2-12
	if (n == 1) return x;
	if (n + tmp > x) return 0;
	assert(tmp >= 0);
	dp[n + tmp] = 1;
	for (int i = 0; i < 2; ++i) {
		for (int j = n + tmp; j + 1 <= x; ++j)
			dp[j + 1] = (dp[j + 1] + dp[j]) % MD;
	}
	for (int i = 1; i <= n - 2; ++i) {
		for (int j = n + tmp; j + i + 1 <= x; ++j)
			dp[j + i + 1] = (dp[j + i + 1] + dp[j]) % MD;
	}
	int res = 0;
	for (int i = n + tmp; i <= x; ++i) res = (res + dp[i]) % MD;
	memset(dp, 0, (x + 1) * sizeof *dp);
	return res;
}

int main() {
	int t;
	scanf("%d", &t);
	while (t--) printf("%d\n", solve());
}
```
