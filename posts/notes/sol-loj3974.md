---
date: '2023-11-01'
title: 'Solution -「JOISC 2023」旅行'
---

## Desc.

[Link.](https://loj.ac/p/3974)

给定一棵 $n$ 个节点的树, $m$ 个关键点 $\{a_m\}$, 和 $q$ 次询问 $l_i, r_i$. 每次询问点集 $\{a_l, \dots, a_r\}$ 在原树上虚树的大小.

$1 \leqslant n, q \leqslant 10^5$.

## Sol.

考虑离线扫描线, 按 $l$ 排序. 每次扫描线加入一个点 $i$ 时, 就将 $a_i$ 到根节点这条路径上的节点的颜色覆盖为 $i$, 然后查询的答案就是树上所有颜色 $\leqslant r_i$ 的节点数减去 $a_l, \dots a_r$ 的 LCA 的深度.

具体实现, 先采用树剖, 颜色覆盖用 `std::set` 维护 (基于随机的颜色段均摊), 这里的复杂度是有保障的. 至于查询的第一部分, 使用树状数组维护即可. 第二部分可以用一个经典结论, 即若干个点的 LCA 等于 DFN 最小和最大的两点的 LCA, 用 RMQ 维护即可.

复杂度不会算, 但是跑得飞快.

```cpp
struct RMQ {
    const int n;
    int t;
    vvi fi, fx;
    RMQ(const vi& v) : n(v.size()) {
        t = __lg(n)+1;
        fi = fx = vvi(t);
        fi[0] = fx[0] = v;
        for (int i=1;i<t;++i) {
            fi[i] = fx[i] = vi(n-(1<<i)+1);
            for (int j=0;j+(1<<i)<=n;++j) {
                fi[i][j] = min(fi[i-1][j], fi[i-1][j+(1<<(i-1))]);
                fx[i][j] = max(fx[i-1][j], fx[i-1][j+(1<<(i-1))]);
            }
        }
    }
    int evalmin(int l, int r) {
        assert(0 <= l && l < r && r <= n);
        int k = __lg(r-l);
        return min(fi[k][l], fi[k][r-(1<<k)]);
    }
    int evalmax(int l, int r) {
        assert(0 <= l && l < r && r <= n);
        int k = __lg(r-l);
        return max(fx[k][l], fx[k][r-(1<<k)]);
    }
};
struct Interval {
    int l, r;
    mutable int v;
    Interval(int _l, int _r, int _v) : l(_l), r(_r), v(_v) {}
    bool operator<(const Interval& rhs) const { return l < rhs.l; }
};
set<Interval> odt;
int n, m, q, dfn[100100], times, ans[100100], dep[100100], fa[100100], t, rev[100100];
int son[100100], top[100100], sz[100100];
vi grp[100100];
void dfs(int u, int Fu) {
    dep[u] = dep[Fu]+1;
    fa[u] = Fu;
    sz[u] = 1;
    for (int v : grp[u])
        if (v != Fu) {
            dfs(v, u);
            sz[u] += sz[v];
            if (sz[v] > sz[son[u]]) son[u] = v;
        }
}
void dfs2(int u, int ct) {
    rev[dfn[u] = times++] = u;
    top[u] = ct;
    if (son[u] < n) dfs2(son[u], ct);
    for (int v : grp[u])
        if (v != fa[u] && v != son[u]) dfs2(v, v);
}
int glca(int u, int v) {
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        u = fa[top[u]];
    }
    return dep[u] < dep[v] ? u : v;
}
int bit[100100];
void add(int p, int x) {
    for (p++;p<=m;p+=p&-p) bit[p] += x;
}
int ask(int p) {
    int res = 0;
    for (;p;p-=p&-p) res += bit[p];
    return res;
}
///  @returns: [l, x), pointer at [x, r]
auto split(int x) {
    if (x == n) return odt.end();
    auto it = --odt.upper_bound(Interval(x, 0, 0));
    if (it->l == x) return it;
    auto [l, r, v] = *it;
    odt.erase(it);
    odt.emplace(l, x-1, v);
    return odt.emplace(x, r, v).fs;
}
void assign(int l, int r, int x) {
    auto ir = split(r+1), il = split(l);
    for (auto it=il;it!=ir;++it)
        if (it->v >= 0) add(it->v, it->l-it->r-1);
    odt.erase(il, ir);
    odt.emplace(l, r, x);
    add(x, r-l+1);
}
void access(int u, int x) {
    for (;u<n;u=fa[top[u]])
        assign(dfn[top[u]], dfn[u], x);
}
int main() {
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    cin >> n >> m >> q;
    t = __lg(n)+1;
    for (int i=1,u,v;i<n;++i) {
        cin >> u >> v;
        u--, v--;
        grp[u].pb(v), grp[v].pb(u);
    }
    fill(son, son+n, n);
    fa[n] = n;
    dfs(0, n);
    dfs2(0, 0);
    vi init(m);
    for (int i=0,x;i<m;++i) {
        cin >> x;
        x--;
        init[i] = dfn[x];
    }
    RMQ st(init);
    vt<vt<pii>> mnt(m);
    for (int i=0,l,r;i<q;++i) {
        cin >> l >> r;
        l--;
        assert(0 <= l && l < m);
        mnt[l].eb(r, i);
        int xl = st.evalmin(l, r);
        int xr = st.evalmax(l, r);
        ans[i] -= dep[glca(rev[xl], rev[xr])]-1;
    }
    odt.emplace(0, n-1, -1);
    for (int i=m-1;i>=0;--i) {
        access(rev[init[i]], i);
        for (auto&& [r, id] : mnt[i]) ans[id] += ask(r);
    }
    for (int i=0;i<q;++i) cout << ans[i] << "\n";
}
```

---

> 君子之交淡若水，因为淡所以不腻，才能持久。
>
> —— [梁实秋 - *谈友谊*](http://www.ccview.net/htm/xiandai/wen/liangshiqiu001.htm)