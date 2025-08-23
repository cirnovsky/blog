---
date: 2022-11-18
title: 「loc - 47725」nomod
category: notes
tags: [binary-search,dp]
---

&emsp;&emsp;[link．](http://222.180.160.110:1024/problem/47725)

> 给定一个长度为 $n$ 的序列 $\{a_n\}$。要求将这个序列分成互不相交的 $k$ 段，**每一段的长度为 $m$**．记第 $p$ 段的左端点和右端点分别为 $l_p$，$r_p$．要求最大化 $\displaystyle \sum_{i=1}^k\max_{j=l_i}^{r_i}\{a_j\}$．
>
> $n,a_i \leqslant 5 \times 10^5$．

&emsp;&emsp;这是个 wqs 二分的题，我们先写出没有「$k$ 段」这个限制的 dp．设 $f_i$ 表示钦定 $i$ 这个位置是某一段的结尾的最大收益．转移即 $\displaystyle f_i = \max_{0 \leqslant j \leqslant i-m} \{dp[j]\}+\max_{i-m+1 \leqslant j \leqslant i} \{a_j\}$，后面那个 max 可以单调队列预处理．把 $f_i$ 前缀 max 一下，可以得到 $f_i = \max_{0 \leqslant j \leqslant i-m} \{f_{i-m}+g_i, f_{i-1}\}$，其中 $g_i$ 就是第一个方程的第二个 max．

&emsp;&emsp;然后就可以直接 wqs 二分了．

```cpp
#include <iomanip>
#include <iostream>
using std::cin;
using std::cout;
using ll = long long;
#define rep(i,a,b) for (int i(a); i<=(b); ++i)
#define drep(i,b,a) for (int i(b); i>=(a); --i)

int n, m, k, a[500100], que[500100], H, T, idx[500100];
ll dp[500100], mx[500100];

int chk(double e) {
    rep(i,m,n) {
        if (dp[i-m]+mx[i]-e > dp[i-1]) dp[i] = dp[i-m]+mx[i]-e, idx[i] = idx[i-m]+1;
        else dp[i] = dp[i-1], idx[i] = idx[i-1];
    }
    return idx[n];
}

signed main() {
    std::ios::sync_with_stdio(0);
    cin.tie(0);
    cout << std::fixed;
    cout << std::setprecision(0);
    cin >> n >> m >> k;
    rep(i,1,n) cin >> a[i];
    H = 1, T = 0;
    rep(i,1,n) {
        while (H <= T && que[H] <= i-m) H++;
        while (H <= T && a[que[T]] <= a[i]) T--;
        que[++T] = i;
        if (i >= m) mx[i] = a[que[H]];
    }
    double l = -5e5, r = 5e5, mid;
    for (int tc=60; tc--;) {
        if (chk(mid = (l+r)/2) >= k) l = mid;
        else r = mid;
    }
    chk(l);
    cout << dp[n]+l*k << "\n";
}
// mx[i] = max[i-m+1, i]
// dp[i] = max_[0 <= j <= i-m]{dp[j]+max[i-m+1, i]}
// dp[i] = max[0 <= j <= i-m]{dp[j]} + mx[i]
// dp[i] = max{dp[i-1], dp[i-m]+mx[i]}
```
    