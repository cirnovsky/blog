---
date: '2023-10-13'
title: 'Solution -「GYM 104128E」Color the Tree'

---

## Desc.

[Link.](https://codeforces.com/gym/104128/problem/E)

给出树 $T=(V,E)$, 一个代价数组 $a_0,\dots, a_{n-1}$. 现欲对该树进行黑白染色, 所有节点初始皆为白色, 每次你可以令节点 $u$ 的**子树**中距离 $u$ 为 $i$ 的节点以 $a_i$ 的代价染为黑色. 问将整棵树染为黑色的最小代价.

$n \leqslant 10^5$.

## Sol.

朴素做法即, 设 $f_{u, d}$ 为将子树 $u$ 中距离 $u$ 为 $d$ 的节点染为黑色的最小代价, 直接转移即可. $\mathcal O(n^2)$. 以下是朴素部分的代码:

```cpp
void dfs2(int u) {
    for (int v : grp[u]) dfs2(v);
    for (int i=0;i<=m-dep[u];++i) dp[u][i] = a[i];
    static ll sum[N + 5];
    memset(sum, 0, (m-dep[u])*8);
    for (int v : grp[u]) {
        for (int i=0;i<=m-dep[v];++i) sum[i] += dp[v][i];
    }
    for (int i=0;i<m-dep[u];++i) chkmin(dp[u][i+1], sum[i]);
}
```

然后可以发现, 我们对于不同深度染色最小代价的计算是独立的, 于是枚举 $d$, 我们求解将原树中深度为 $d$ 的节点染黑的最小代价. 后面的做法就很暴力了, 直接将深度为 $d$ 的节点拉出来建虚树, 跑朴素 DP 即可. $\mathcal O(n\log_2 n)$ / $\mathcal O(n)$, 根据具体实现复杂度不同.

```cpp
void solve() {
    int n; cin >> n;
    vi a(n); rds(a);
    const int LG = __lg(n)+1;
    vvi mn(LG);
    mn[0] = a;
    for (int i=1;i<LG;++i) {
        mn[i].resize(n-(1<<i)+1);
        for (int j=0;j<n-(1<<i)+1;++j) mn[i][j] = min(mn[i-1][j], mn[i-1][j+(1<<i-1)]);
    }
    auto getMin = [&](int l, int r) {
        assert(0 <= l && l <= r && r < n);
        int k = __lg(r-l+1);
        return min(mn[k][l], mn[k][r-(1<<k)+1]);
    };
    vvi grp(n);
    for (int i=1,u,v;i<n;++i) {
        cin >> u >> v; u--; v--;
        grp[u].pb(v);
    }
    vvi fa(LG, vi(n+1, n));
    function<void(int)> dfs2 = [&](int u) {
        for (int i=1;i<LG;++i) fa[i][u] = fa[i-1][fa[i-1][u]];
        for (int v : grp[u]) fa[0][v] = u, dfs2(v);
    };
    dfs2(0);
    vi dep(n), dfn(n);
    int timeStamp = 0;
    function<void(int)> dfs = [&](int u) {
        dfn[u] = timeStamp++;
        for (int v : grp[u]) dep[v] = dep[u]+1, dfs(v);
    }; dep[0] = 1; dfs(0);
    auto getLca = [&](int u, int v) {
        if (dep[u] < dep[v]) swap(u, v);
        for (int i=LG-1;i>=0;--i)
            if (fa[i][u] < n && dep[fa[i][u]] >= dep[v]) u = fa[i][u];
        if (u == v) return u;
        for (int i=LG-1;i>=0;--i)
            if (fa[i][u] != fa[i][v]) u = fa[i][u], v = fa[i][v];
        return fa[0][u];
    };
    int m = *max_element(allu(dep));
    vvi idep(m+1);
    for (int i=0;i<n;++i) idep[dep[i]].pb(i);
    ll ans = 0;
    vvi virt(n);
    auto createVirtualTree = [&](vi h) {
        sort(allu(h), [&](int x, int y) {
            return dfn[x] < dfn[y];
        });
        for (int i=0,sz=h.size();i<sz-1;++i) h.pb(getLca(h[i], h[i+1]));
        sort(allu(h), [&](int x, int y) {
            return dfn[x] < dfn[y];
        });
        h.erase(unique(allu(h)), h.end());
        for (int i=0,sz=h.size();i<sz-1;++i) virt[getLca(h[i], h[i+1])].pb(h[i+1]);
        return h[0];
    };
    for (int i=m;i>=1;--i) {
        int rt = createVirtualTree(idep[i]);
        function<ll(int)> dfs3 = [&](int u) {
            if (!virt[u].empty()) {
                ll res = 0;
                for (int v : virt[u]) res += dfs3(v);
                virt[u].clear();
                return min(res, (ll)getMin(i-dep[u], i-1));
            } else return (ll)getMin(0, i-1);
        };
        ans += dfs3(rt);
    }
    cout << ans << "\n";
}
```

--- 

> / 看着蔚蓝的天空被电线分割了 /
> 
> / 天空下的你和我擦肩过 /
> 
> / 就像风起风落 /
> 
> / 曾有一张白纸在面前铺陈着 /
> 
> / 提起笔勾勒出了轮廓 /
> 
> —— [孤寂code - *平行* ft. 洛天依](https://mzh.moegirl.org.cn/%E5%B9%B3%E8%A1%8C)