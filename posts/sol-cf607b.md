---
date: '2020-04-01'
title: 'Solution -「CF 607B」Zuma'
category: 'Notes'
---

## 前言

不知为何我感觉这篇题解的 $\LaTeX$ 容易崩，崩了的话上面去我的洛谷博客查看吧。

## 题意简述

给你一个长度为 $n$ 的序列，每次你可以删除一回文串，问最少多少步能把这个序列删干净。

## 题解

考虑区间dp。

状态定义很显然：$dp_{i,j}$ 表示删除区间 $[i,j]$ 的最少步数。

那么状态的转移也很简单了。

$$
dp_{i,j}=dp_{i+1,j-1},a_{i}=a_{j}
$$

$$
dp_{i,j}=\min_{i\le k\le j}\{dp_{i,j},dp_{i,k}+dp_{k+1,j}\}
$$

边界也很显然。

$$
dp_{i,i}=1
$$

$$
dp_{i,i+1}=1+[a_{i}\neq a_{i+1}]
$$

最终答案就是 $dp_{1,n}$

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>

using namespace std;

const int MAXN = 5e2 + 5;
int n, a[MAXN], dp[MAXN][MAXN];

signed main() {
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i) scanf("%d", &a[i]);
	for (int i = 1; i <= n; ++i) dp[i][i] = 1;
	for (int i = 1; i < n; ++i) dp[i][i + 1] = 1 + (a[i] != a[i + 1]);
	for (int dis = 3; dis <= n; ++dis) {
		for (int l = 1, r = dis; r <= n; ++l, ++r) {
			dp[l][r] = 0x3f3f3f3f;
			if (a[l] == a[r]) dp[l][r] = dp[l + 1][r - 1];
			for (int k = l; k <= r; ++k) dp[l][r] = min(dp[l][r], dp[l][k] + dp[k + 1][r]);
		}
	}
	printf("%d\n", dp[1][n]);
	return 0;
}
```