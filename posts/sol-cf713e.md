---
date: 2022-10-17
title: 「codeforces - 713E」Sonya Partymaker
category: notes
tags: [binary-search,graph-theory,greedy]
---

[link。](https://codeforces.com/contest/713/problem/E)

首先二分答案固定每个 bot 的步长，然后就基本上弱于 [*codeforces - 1476F*](http://codeforces.com/problemset/problem/1476/F) 了，但是还是有些不一样的地方。

假如我们是在一个序列上做 dp，不妨把原环按 $n$-$1$ 之间的间隙破开。令 $f(i)$ 表示经过决策前 $i$ 个 bots，最远能覆盖到的坐标（连续地覆盖了 $1 \sim f(i)$）。转移即分类讨论，同时令 $x$ 为当前步数：

- 前 $i-1$ 个 bots 能够覆盖到 $i-1$，那么 bot $i$ 就可以往后面倒，即 $f(i) \gets p_i+x$；<element style="text-align:right">$(1)$</element>
- 前 $i-1$ 个 bots 不能够覆盖到 $i-1$，但是可以覆盖到 $i-x-1$，那么 bot $i$ 就只能往前面倒来把序列连上。<element align="right">$(2)$</element>

乍看这样的分类讨论已经足够了，~~但是这个 dp 状态实际上是省略了一维的，即 $k$，$k$ 表示在 $1 \sim i$ 的 bots 当中是 bot $k$ 来将 $1 \sim f(i-1)$ 的殖民地连上的，基于贪心的策略我们把 $k$ 省掉，即尽量取靠后的 $k$。~~上述论证是有错误的，但大致上的意思没错，即转移如果最朴素地做并不是连续的。再看到我们的转移，如果 bot $i$ 连上了 $1 \sim f(i-2)$，则 bot $i-1$ 可以往后倒从而使 $f(i) \gets p_{i-1}+x$。<element align="right">$(3)$</element>

考虑环。只需要分类讨论 bot $1$ 往左往右倒即可，比较容易。

```cpp
/*-ukpkmpkk-*/
#include <iostream>
#include <algorithm>
#define cmax(x, y) x = max(x, y)
using std::cin; using std::cout;
using std::min; using std::max;
int m, n, a[200100], p[100100], dp[100100];
bool chk(int cur) {
    dp[1] = 0;
    for (int i=2; i<=n; ++i) {
        dp[i] = dp[i-1];
        if (dp[i-1] >= p[i]-1) {
            cmax(dp[i], p[i]+cur);
        }
        if (dp[i-1] >= p[i]-cur-1) {
            cmax(dp[i], p[i]);
        }
        if (i > 2 && dp[i-2] >= p[i]-cur-1) {
            cmax(dp[i], p[i-1]+cur);
        }
    }
    if (dp[n] >= m-cur-1) return 1;
    dp[2] = max(p[2], cur);
    for (int i=3; i<=n; ++i) {
        dp[i] = dp[i-1];
        if (dp[i-1] >= p[i]-1) {
            cmax(dp[i], p[i]+cur);
        }
        if (dp[i-1] >= p[i]-cur-1) {
            cmax(dp[i], p[i]);
        }
        if (dp[i-2] >= p[i]-cur-1) {
            cmax(dp[i], p[i-1]+cur);
        }
    }
    if (dp[n] >= min(m-1, m+p[2]-cur-1)) return 1;
    return 0;
}
signed main() {
    std::ios::sync_with_stdio(0);
    cin.tie(0);
    cin >> m >> n;
    for (int i=1; i<=n; ++i) {
        cin >> a[i];
        a[i+n] = a[i]+m;
    }
    std::sort(a+1, a+n+n+1);
    int pos = 1;
    for (int i=2; i<=n; ++i) {
        if (a[i+1]-a[i] > a[pos+1]-a[pos]) {
            pos = i;
        }
    }
    for (int i=1; i<=n; ++i) {
        p[i] = a[i+pos];
    }
    for (int i=2; i<=n; ++i) {
        p[i] -= p[1];
    }
    p[1] = 0;
    int l = 0, r = a[pos+1]-a[pos]-1, mid, res = r;
    while (l <= r) {
        if (chk(mid = (l+r)/2)) r = mid-1, res = mid;
        else l = mid+1;
    }
    cout << res << "\n";
}
```
    