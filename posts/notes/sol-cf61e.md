---
date: '2020-04-04'
title: 'Solution -「CF 61E」Enemy is weak'

---

## 题意简述

求三元逆序对数量。

## 题解

参考求二元逆序对的过程，将统计结果的加法改为乘法即可。

~~真的就这么点东西不要说我说明过少啊~~

```cpp
#include <bits/stdc++.h>

const int N = 1e6 + 5;
int n, bit[N], rnk[N];
long long ans, apr[N];
struct st{
	int id, val;
	friend bool operator < (st x, st y) {
		if (x.val == y.val) return x.id < y.id;
		else return x.val < y.val;
	}
} a[N];

void add(int x, int y) {
	for (; x <= n; x += x & -x)
		bit[x] += y;
}

int ask(int x) {
	int res = 0;
	for (; x; x -= x & -x)
		res += bit[x];
	return res;
}

int main() {
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i) scanf("%d", &a[i].val), a[i].id = i;
	std::sort(a + 1, a + 1 + n);
	for (int i = 1; i <= n; ++i) rnk[a[i].id] = i;
	for (int i = n; i >= 1; --i) apr[i] = ask(rnk[i] - 1), add(rnk[i], 1);
	for (int i = 1; i <= n; ++i) bit[i] = 0;
	for (int i = 1; i <= n; ++i) ans += apr[i] *= (ask(n) - ask(rnk[i])), add(rnk[i], 1);
	return printf("%lld\n", ans) & 0;
}
```