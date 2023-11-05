---
date: '2023-10-14'
title: 'Solution -「JOISC 2022」刑務所'

---

## Desc.

有无根树 $T = (V, E)$, 有 $m$ 个囚犯, 初始分别位于 $s_i$ 节点上. 每一时刻你可以将某个囚犯沿着无向边移动到相邻的节点, 判断是否存在一个方案, 使得所有囚犯分别**沿着最短路径**被移动到 $t_i$ 节点上, 并且不会出现同一时刻有两个或多个囚犯在同一节点上的情况. 多测.

$T \leqslant 10^3, n \leqslant 1.2 \times 10^5, 2 \leqslant m < n$.

## Sol.

[Link.](https://loj.ac/p/3685)

有一条性质:

- 同一时间图上不会有两个移动中的囚犯.

证明很简单, 钦定两个囚犯, 并讨论两条路径的相对关系即可.

有另外两条比较好看出来, 但应该不太好证的性质:

- 若囚犯 $j$ 的**起点** $s_j$ 位于另外某个囚犯 $i$ 的路径 $(s_j, t_j)$ 上, 那么 $i$ 一定**先于** $j$ 出发;
- 若囚犯 $j$ 的**终点** $s_j$ 位于另外某个囚犯 $i$ 的路径 $(s_j, t_j)$ 上, 那么 $i$ 一定**晚于** $j$ 出发;

~~意会一下吧.~~

根据上述的先后关系, 可以建出关于囚犯的有向图, 若该图存在拓扑序 (即为 DAG), 那么有解, 否则无解. 问题是如何优化连边. 将原树复制为两棵, 分别称为 $S$, $T$, 记原树节点 $i$ 在两棵新树上的对应节点编号为 $S_i$ 和 $T_i$. 将每个囚犯抽象成一个点, 编号记为 $p_i$, 我们来看看如何改写原题的信息. 连边 $\lang p_i, S_{s_i}\rang, \lang T_{t_i}, p_i \rang$, $\lang v \in (S_{s_i}, S_{t_i}) \setminus \{S_{s_i}\}, p_i \rang$, $\lang p_i, v \in (T_{s_i}, T_{t_i}) \setminus \{T_{t_i}\}\rang$.

我们来检验一下这样建图的可行性, 若 $s_i$ 在 $(s_j, t_j)$ 上, 那么存在路径 $p_i \rightarrowtail S_{s_i} \rightarrowtail p_j$, 反之亦然, 则先后关系得到了刻画. 再来考察正确性, 发现我们只是把直接连接 $p_i$ 和 $p_j$ 的边通过拆分 $(s_j, t_j)$ 的方式加「长」了, 因此并不会影响环的存在性.

那么使用重链剖分, 然后线段树优化建图即可.

这个代码写着太自闭了, 先是 Linux 爆栈, 用 Windows 跑比题解快一倍, 但是交上去就是过不了... 服了. 以下代码过不了, 就看个乐呵吧.

```cpp[class="line-numbers"]
const int N = 1.2e5;
int n, dfn[N + 5], rev[N + 5], fa[20][N + 5], dep[N + 5], son[N + 5], top[N + 5], times;
vvi grp, grp2;
vi deg;
void dfs(int u, int Fu) {
    rev[dfn[u] = times++] = u, dep[u] = dep[Fu]+1, fa[0][u] = Fu;
    for (int i=1;i<20;++i) fa[i][u] = fa[i-1][fa[i-1][u]];
    for (int v : grp[u]) if (v != Fu) dfs(v, u);
}
void dfs2(int u, int Fu, int t) {
    top[u] = t;
    if (son[u] < n) dfs2(son[u], u, t);
    for (int v : grp[u]) if (v != Fu && v != son[u]) dfs2(v, u, v);
}
void safe_add(int u, int v) {
    if ((unsigned)u >= grp2.size()) grp2.resize(u+1);
    if ((unsigned)v >= grp2.size()) grp2.resize(v+1);
    grp2[u].pb(v);
    if ((unsigned)v >= deg.size()) deg.resize(v+1);
    deg[v]++;
}
int tot; // Ids distribution.
int tr1[N + 5], tr2[N + 5], id1[N * 4 + 5], id2[N * 4 + 5];
void build(int u, int l, int r) {
    id1[u] = tot++, id2[u] = tot++;
    if (l == r) {
        safe_add(id1[u], tr1[rev[l]]);
        safe_add(tr2[rev[l]], id2[u]);
    } else {
        int mid = (l+r)/2;
        build(u*2, l, mid); build(u*2+1, mid+1, r);
        safe_add(id1[u], id1[u*2]);
        safe_add(id1[u], id1[u*2+1]);
        safe_add(id2[u], id2[u*2]);
        safe_add(id2[u], id2[u*2+1]);
    }
}
void lnk(int fr, int ba, int rt, bool flag, int u, int l, int r) {
    if (l > ba || r < fr) return;
    else if (l >= fr && r <= ba) {
        if (flag == 0) safe_add(rt, id1[u]);
        else safe_add(id2[u], rt);
    }
    else {
        int mid = (l+r)/2;
        lnk(fr, ba, rt, flag, u*2, l, mid), lnk(fr, ba, rt, flag, u*2+1, mid+1, r);
    }
}
int jump(int u, int d) {
    for (int i=0;i<20;++i) if (d&(1<<i)) u = fa[i][u];
    return u;
}
int getLca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    u = jump(u, dep[u]-dep[v]);
    if (u == v) return u;
    for (int i=19;i>=0;--i)
        if (fa[i][u] != fa[i][v]) u = fa[i][u], v = fa[i][v];
    return fa[0][u];
}
void cover(int u, int v, int rt, bool flag) {
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        lnk(dfn[top[u]], dfn[u], rt, flag, 1, 0, n-1);
        u = fa[0][top[u]];
    }
    if (dfn[u] > dfn[v]) swap(u, v);
    lnk(dfn[u], dfn[v], rt, flag, 1, 0, n-1);
}
bool isdag() {
    queue<int> que;
    for (int i=0;i<tot;++i) if (!deg[i]) que.push(i);
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int v : grp2[u]) if (!--deg[v]) que.push(v);
    }
    return !count_if(allu(deg), [&](int x) { return x > 0; });
}
void solve() {
    cin >> n;
    // TODO: clear.
    fill(son, son+n, n);
    vvi(n).swap(grp);
    vvi().swap(grp2);
    vi().swap(deg);
    tot = times = 0;
    for (int i=0;i<n;++i) tr1[i] = tot++;
    for (int i=0;i<n;++i) tr2[i] = tot++;
    for (int i=1,u,v;i<n;++i) {
        cin >> u >> v; u--; v--;
        grp[u].pb(v), grp[v].pb(u);
    }
    for (int i=0;i<=n;++i) {
        for (int j=0;j<20;++j) fa[j][i] = n;
    }
    dep[n] = 0;
    dfs(0, n);
    return;
    dfs2(0, n, 0);
    build(1, 0, n-1);
    int m; cin >> m;
    for (int s,t,i=0;i<m;++i) {
        cin >> s >> t; s--; t--;
        int p = tot++;
        int fs, ft, lca = getLca(s, t);
        if (s == lca) fs = jump(t, dep[t]-dep[s]-1);
        else fs = fa[0][s];
        if (t == lca) ft = jump(s, dep[s]-dep[t]-1);
        else ft = fa[0][t];
        cover(s, ft, p, 0);
        cover(fs, t, p, 1);
        safe_add(tr1[t], p);
        safe_add(p, tr2[s]);
    }
    cerr << tot << ' ';
    cout << (isdag() ? "Yes\n" : "No\n");
}
int main()
{
    freopen("in", "r", stdin);
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    int t; cin >> t; while (t--) solve();
}
```

---

>/ 恍然间 我已经 安然地 来到你身旁 /
>
>/ 如暗夜灯塔 指引流星归家 /
>
>/ 孤单的小船 在漫长漂泊后 终于靠岸 /
>
>—— [Ddickky - *最终祈愿* ft. 星尘](https://vocadb.net/S/389429)