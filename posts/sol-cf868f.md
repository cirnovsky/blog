---
date: 2021-09-25
title: 「codeforces - 868F」Yet Another Minimization Problem
category: notes
tags: [dp,divide-and-conquer]
---

[link。](http://codeforces.com/problemset/problem/868/F)

值域分治优化决策单调性 DP 的 trick。朴素做法 trivial，不赘述。

考虑求取一个区间 $[l,r]$ 的 DP 值。先搞定在 $m=\lfloor\frac{l+r}{2}\rfloor$ 的 DP 最优决策点，由于决策的单调性，$[l,m)$ 和 $(m,r]$ 的最优决策点就在 $[l',m']$ 和 $[m',r']$（$'$ 系列变量代表最优决策点）。

于是值域分治解决。

<details>

```cpp
#include <bits/stdc++.h>
template <class T> inline void chmax(T& a, const T b) { a = a > b ? a : b; }
template <class T> inline void chmin(T& a, const T b) { a = a < b ? a : b; }
inline long long rd() {
  long long x = 0; bool f = 0; char ch = getchar();
  while (ch < '0' || ch > '9') f |= (ch == '-'), ch = getchar();
  while (ch >= '0' && ch <= '9') x = x * 10 + (ch & 15), ch = getchar();
  return f ? -x : x;
}
template <class T>
constexpr T kInf = std::numeric_limits<T>::max();
int n, k, a[100100]; long long dp[100100][30];
namespace sm {
long long Res = 0; int app[100100], L = 1, R;
inline long long res() { return Res; }
inline long long cal(int x) { return 1ll * x * (x - 1) / 2; }
void prog(int l, int r) {
  auto upd = [&](int p, int d) -> void {
    Res -= cal(app[a[p]]);
    app[a[p]] += d;
    Res += cal(app[a[p]]);
  };
  while (L > l) upd(--L, 1);
  while (R < r) upd(++R, 1);
  while (L < l) upd(L++, -1);
  while (R > r) upd(R--, -1);
}
}  // namespace Sweepline Mo
void Rawgrass(int l, int r, int lg, int rg, int K) {
  if (l > r) return;
  int mid = (l + r) >> 1, pos = 0, rrg = std::min(rg, mid - 1);
  dp[mid][K] = kInf<long long>;
  for (int t = lg; t <= rrg; ++t) {
    sm::prog(t + 1, mid);
    if (dp[t][K - 1] != kInf<long long> && dp[mid][K] > dp[t][K - 1] + sm::res())
      dp[mid][K] = dp[t][K - 1] + sm::res(), pos = t;
  }
  Rawgrass(l, mid - 1, lg, pos, K);
  Rawgrass(mid + 1, r, pos, rg, K);
}
signed main() {
  n = rd(), k = rd();
  for (int i = 1; i <= n; ++i) a[i] = rd();
  for (int i = 1; i <= n; ++i) sm::prog(1, i), dp[i][1] = sm::res();
  for (int i = 2; i <= k; ++i) Rawgrass(1, n, 1, n, i);
  printf("%lld\n", dp[n][k]);
  return 0;
}
```

</details>
    