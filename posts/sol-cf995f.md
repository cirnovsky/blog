---
date: 2022-09-22
title: 「codeforces - 995F」Cowmpany Cowmpensation
category: notes
tags: [maths]
---

[link。](http://codeforces.com/problemset/problem/995/F)

关于 Lagrange Interpolation。

> **插值**即是对于给出的向量组 $V = (v_0, ..., v_{n-1})$，其中 $v_i = (x_i, y_i)$，构造一个函数 $f(x)$ 使得 $\forall i$，有 $f(x_i) = y_i$。

朴素做法即对方程组消元，$O(n^3)$。

Lagrange 插值则是选择了类 CRT 的构造方法，即构造 $n$ 个函数 $f_i(x)$，使得 $\forall i$，有 $f_i(x_i) = y_i$，$\forall j \neq i$，有 $f_i(x_j) = 0$，那么构造结果 $f(x) = \sum \limits_{i=0}^{n-1} f_i(x)$。对于一个 $i$，我们有 $f_i(x) = a_i \times \prod \limits_{i \neq j} x-x_j$，此时若 $a_i \neq = 0$，则我们已经满足了条件二；考虑条件一，令 $a_i = \frac{y_i}{\prod \limits_{i \neq j} x-x_j}$ 即可，即有 $f(x) = \sum \limits_{i=0}^{n-1}y_i\prod\limits_{i\neq j}\frac{x-x_j}{x_i-x_j}$，$O(n^2)$。

看回这个题，朴素的 dp 做法即是令 $dp[u][d]$ 表示考虑子树 $u$ 的方案数，满足 $u$ 的赋权为 $d$，转移即各个子树的 dp 和的乘积，容易看出这是个多项式，即 $dp[u][d]$ 是关于 $d$ 的 $s_u-1$ 次多项式，其中 $s_u$ 为 $u$ 的子树大小。考虑差分 $dp[u][d]-dp[u][d-1] = \prod dp[v][d]$，又因为叶子结点满足条件即证。

那么求出 $dp[0][0 \dots n]$，插值求出其曲线方程，带入 $d$ 即可。

```cpp
const int mod = 1e9+7;
il int sub(int x,int y) {
    if ((x-=y)<0) x+=mod;
    return x;
}
il int mul(int x,int y) {
    return static_cast<long long>(x)*y%mod;
}
il void adds(int& x,int y) {
    if ((x+=y)>=mod) x-=mod;
}
il void muls(int& x,int y) {
    x=static_cast<long long>(x)*y%mod;
}
il int qpow(int x,int y) {
    int z(1);
    for (; y; y>>=1,muls(x,x))
        if (y&1) muls(z,x);
    return z;
}
il int inv(int m) {
    assert(m>0);
    return qpow(m,mod-2);
}
int n, dp[3<<10][3<<10], d, Y[3<<10];
bsi<int> adj[3<<10];
void dfs(int x) {
    rep(i,1,n+1) dp[x][i] = 1;
    for (auto y : adj[x]) {
        dfs(y);
        rep(i,1,n+1) muls(dp[x][i], dp[y][i]);
    }
    rep(i,1,n+1) adds(dp[x][i], dp[x][i-1]);
}
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    int x;
    cin >> n >> d;
    rep(i,1,n) {
        cin >> x;
        x--;
        adj[x] += i;
    }
    dfs(0);
    rep(i,n+1) Y[i] = dp[0][i];
    int ans=0;
    rep(i,n+1) {
        int u=Y[i],v=1;
        rep(j,n+1) if (i!=j) muls(u,sub(d,j)),muls(v,sub(i,j));
        adds(ans,mul(u,inv(v)));
    }
    cout<<ans<<"\n";
}
```
    