---
date: '2023-11-01'
title: 'Solution -「JOISC 2023」ふたつの通貨'
---

## Desc.

[Link.](https://loj.ac/p/3966)

给出一棵 $n$ 个节点的树，在其中 $m$ 条边上俢设收费站，通过收费站 $i$ 可选择付一枚金币或 $c_i$ 枚银币。现在有 $q$ 个市民，要从 $s_i$ 旅行到 $t_i$，带有 $x_i$ 枚金币和 $y_i$ 枚银币。最大化旅行结束后金币的保有量，或报告无解。

$1\leqslant n, q \leqslant 10^5$。

## Sol.

由于金币的支出总为一，因此贪心策略很显然，将路径上的 $c$ 排序，从小到大能选辄选。能够选择的数量可以二分算，由于在树上，用可持久化线段树维护即可。

具体而言，每次新建一棵树，都从父亲继承，询问时需要使用到的子树和，可以通过求 LCA  转化成树上差分。

这个线段树上二分的写法有点说头。在当前节点做决策而非在递归左右子树之前做判断能让代码更简洁，具体见代码。

最后要注意，离散化的时候要让相同权值的收费站占据不同的编号，而不能直接合并，原因很简单，你可能终止在相同的收费站之间。

```cpp
int n, m, q, rt[100100], tot;
int e[100100][2];
vi mnt[100100], grp[100100];
map<int, int> buc;
int ls[3000100], rs[3000100];
struct node {
    int cnt;
    ll sum;
} tr[3000100];
int upd(int v, int p, ll w, int l = 0, int r = m) {
    int u = ++tot;
    tr[u] = tr[v];
    tr[u].cnt++, tr[u].sum += w;
    if (l+1 == r) return u;
    int mid = (l+r)/2;
    if (mid > p) rs[u] = rs[v], ls[u] = upd(ls[v], p, w, l, mid);
    else ls[u] = ls[v], rs[u] = upd(rs[v], p, w, mid, r);
    return u;
}
int ask(int u, int v, int lca, ll all, int l = 0, int r = m) {
    if (all <= 0) return tr[u].cnt+tr[v].cnt-2*tr[lca].cnt;
    else {
        if (tr[u].sum+tr[v].sum-2*tr[lca].sum <= all) return 0;
        if (l+1 == r) return tr[u].cnt+tr[v].cnt-2*tr[lca].cnt;
        int mid = (l+r)/2;
        ll tmp = tr[ls[u]].sum+tr[ls[v]].sum-2*tr[ls[lca]].sum;
        return ask(ls[u], ls[v], ls[lca], all, l, mid)+ask(rs[u], rs[v], rs[lca], all-tmp, mid, r);
    }
}
int fa[20][100100], t, dep[100100];
void dfs(int u, int Fu) {
    dep[u] = dep[Fu]+1;
    fa[0][u] = Fu;
    for (int i=1;i<t;++i)
        fa[i][u] = fa[i-1][fa[i-1][u]];
    for (int v : grp[u])
        if (v != Fu) dfs(v, u);
}
int LCA(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    for (int i=t-1;i>=0;--i)
        if (dep[fa[i][u]] >= dep[v]) u = fa[i][u];
    if (u == v) return u;
    for (int i=t-1;i>=0;--i)
        if (fa[i][u] != fa[i][v]) u = fa[i][u], v = fa[i][v];
    return fa[0][u];
}
void dfs2(int u) {
    rt[u] = rt[fa[0][u]];
    for (int x : mnt[u])
        rt[u] = upd(rt[u], buc[x]++, x);
    for (int v : grp[u])
        if (v != fa[0][u]) dfs2(v);
}
int main() {
    ignore = freopen("in", "r", stdin);
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    cin >> n >> m >> q;
    t = __lg(n)+1;
    for (int i=0;i<n-1;++i) {
        cin >> e[i][0] >> e[i][1];
        e[i][0]--, e[i][1]--;
        grp[e[i][0]].pb(e[i][1]);
        grp[e[i][1]].pb(e[i][0]);
    }
    for (int i=0;i<t;++i)
        fill(fa[i], fa[i]+n+1, n);
    dfs(0, n);
    vi tmp;
    for (int i=0,p,c;i<m;++i) {
        cin >> p >> c;
        tmp.pb(c);
        p--;
        if (dep[e[p][0]] == dep[e[p][1]]+1) swap(e[p][0], e[p][1]);
        mnt[e[p][1]].pb(c);
    }
    sort(begin(tmp), end(tmp));
    for (int i=m-1;i>=0;--i) buc[tmp[i]] = i;
    dfs2(0);
    while (q--) {
        int u, v, x;
        ll y;
        cin >> u >> v >> x >> y;
        u--, v--;
        int ret = ask(rt[u], rt[v], rt[LCA(u, v)], y);
        cout << max<ll>(x-ret, -1) << "\n";
    }
}
```

---

> / 白头如新，倾盖如故。/
>
> —— [邹阳 - *狱中上梁王书*](https://so.gushiwen.cn/shiwenv_7ddcdcf33399.aspx)