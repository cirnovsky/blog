---
date: 2022-09-17
title: 「codeforces - 1450E」Capitalism
category: notes
tags: [graph-theory]
---

[link。](http://codeforces.com/problemset/problem/1450/E)

首先可以发现，如 $\exists (u, v) \in \mathbf E$，则 $a_u \not \equiv a_v \pmod 2$，那么如果图中存在奇环，则不可能存在解（奇 - 偶 - 奇 矛盾）。那么这就是一个二分图，考虑如何刻画题目中的条件，对于 $a_v = a_u+1$ 型的条件，可以直接用差分约束的方式刻画，即 $a_v \geqslant a_u+1$ 且 $a_v \leqslant a_u+1$；再看到 $\mid a_u - a_v \mid = 1$，则拆成 $-1 \leqslant a_u - a_v \leqslant 1$ 且 $a_u \neq a_v$。

因为奇偶性不同，所以 $a_u \neq a_v$ 一定成立，直接用 Floyd-Warshall 算法跑全源最短路即可。最大极差的限制即最长的两点间最短路。

```cpp
int n, m, dp[1<<8][1<<8], Fa[2<<8];
int rt(int x) {
    while (x != Fa[x]) x = Fa[x] = Fa[Fa[x]];
    return x;
}
void mg(int x, int y) {
    if (rt(x) != rt(y)) Fa[rt(x)] = rt(y);
}
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    int x, y, z;
    cin >> n >> m;
    iota(Fa, Fa+2*n, 0);
    memset(dp, 0x3f, sizeof dp);
    rep(i,n) dp[i][i] = 0;
    rep(m) {
        cin >> x >> y >> z;
        x--, y--;
        mg(x+n, y), mg(x, y+n);
        if (z) dp[x][y] = 1, dp[y][x] = -1;
        else dp[x][y] = dp[y][x] = 1;
    }
    rep(i,n) if (rt(i) == rt(i+n)) return cout<<"no\n", 0;
    rep(k,n) rep(i,n) rep(j,n) cmin(dp[i][j], dp[i][k]+dp[k][j]);
    rep(i,n) if (dp[i][i] < 0) return cout<<"no\n", 0;
    int ans = -233333333, pos = n;
    rep(i,n) {
        int MX = *max_element(dp[i], dp[i]+n);
        if (MX > ans) ans = MX, pos = i;
    }
    cout << "yes\n" << ans << "\n";
    rep(i,n) cout << dp[pos][i] << " \n"[i == n-1];
}
```


    