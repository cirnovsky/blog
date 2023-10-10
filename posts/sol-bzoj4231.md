---
date: '2023-10-09'
title: 'Solution -「BZOJ 4231」回忆树'
category: 'Notes'
---

## Desc.

&emsp;&emsp;[Link.](https://hydro.ac/d/bzoj/p/4231)

&emsp;&emsp;树 $T=(V,E)$, 询问 $Q=\{q_i\}$，每次询问:

- $u~v~s$, 问从 $u$ 到 $v$ 的简单路径上的字符拼接起来字符串中, $s$ 出现了多少次.

## Sol.

&emsp;&emsp;真毒瘤... 😅

&emsp;&emsp;$s$ 对询问 $q_i$ 的贡献可以分为三种:

- 在 $\lang u,lca(u,v)\rang$ 上出现;
- 在 $\lang lca(u,v),v\rang$ 上出现;
- 跨过 $lca(u, v)$.

&emsp;&emsp;其中第三种贡献可能的情况不超过 $\mathcal O(2|s|)$ 种, 拉出来跑哈希或者 KMP 即可.

&emsp;&emsp;对于剩下两种的情况, 我们以模式串的正反串建立 ACAM, 然后对原树 DFS, 那么从根节点到当前节点的树链上组成的字符串即为文本串.

&emsp;&emsp;代码太难打了, 打了一半就跑路了.

```cpp
using pii = pair<int, int>;
using vvp = vector<vector<pii>>;
const int SZ = 3e5;
typedef struct AhoCorasickAutomaton {
    int tot = 1, nxt[SZ + 5][26], fail[SZ + 5], dfn[SZ + 5], out[SZ + 5], num;
    vvi grp;
    void insert(const bsi& s, int& pos) {
        int u = 0;
        for (int i=0;i<(int)s.length();++i) {
            if (!nxt[u][s[i]-'a']) nxt[u][s[i]-'a'] = tot++;
            u = nxt[u][s[i]-'a'];
        }
        pos = u;
    }
    void build() {
        queue<int> que;
        for (int v : nxt[0]) if (v) que.push(v);
        while (!que.empty()) {
            int u = que.front();
            for (int i=0;i<26;++i) if (nxt[u][i]) fail[nxt[u][i]] = nxt[fail[u]][i], que.push(nxt[u][i]);
                else nxt[u][i] = nxt[fail[u]][i];
        }
        grp = vvi(tot);
        for (int i=1;i<tot;++i) grp[fail[i]].pb(i);
        dfs(0);
    }
    void dfs(int u) {
        dfn[u] = num++;
        for (int v:grp[u]) dfs(v);
        out[u] = num;
    }
    int bit[SZ + 5];
    void upd(int p, int d) {
        for (p=dfn[p]+1;p<=tot;p+=p&-p) bit[p] += d;
    }
    int Ask(int p) {
        int res = 0;
        for (p=dfn[p];p;p-=p&-p) res += bit[p];
        return res;
    }
    int Ask(int l, int r) { return Ask(r)-Ask(l); }
} ACAM;
ACAM acam[2];
const int N = 1e5;
int n, q, fa[23][N + 5], ht, dep[N + 5], to[N + 5];
vvp grp;
void dfs(int u, int Fu) {
    fa[0][u] = Fu; dep[u] = dep[Fu] + 1;
    for (int i=1;i<=ht;++i) fa[i][u] = fa[i-1][fa[i-1][u]];
    for (const auto& [v, ch] : grp[u]) if (v != Fu) dfs(v, u), to[v] = ch-'a';
}
int getLca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    for (int i=ht;i>=0;--i) if (dep[fa[i][u]] >= dep[v]) u = fa[i][u];
    if (u == v) return u;
    for (int i=ht;i>=0;--i) if (fa[i][u] != fa[i][v]) u = fa[i][u], v = fa[i][v];
    return fa[0][u];
}
struct Query {
    int u, v, lca, pos[2];
};
int jump(int u, int d) {
    for (int i=0;i<=ht;++i) if (d&(1<<i)) u = fa[i][u];
    return u;
}
bsi extract(int u, int v, int lca, int len) {
    bsi res, tmp;
    u = jump(u, dep[u]-dep[lca]-len);
    v = jump(v, dep[v]-dep[lca]-len);
    while (u != lca) res.pb(to[u]), u = fa[0][u];
    while (v != lca) tmp.pb(to[v]), v = fa[0][v];
    reverse(allu(tmp));
    return res.append(tmp);
}
int solve_passing(const bsi& text, const bsi& pat) {
    static const ull BASE = 1331;
    static ull pw[SZ + 5], h[SZ + 5];
    static void* __tmp = ([]() {
        pw[0] = 1;
        for (int i=1;i<SZ+5;++i) pw[i] = pw[i-1]*BASE;
        return pw;
    })();
    auto get_hash = [&](int l, int r) { return h[r]-h[l-1]*pw[r-l+1]; };
    int m = text.length(), k = pat.length();
    memset(h, 0, m*8);
    ull H = 0;
    for (int x:pat) H = H*BASE+x;
    for (int i=0;i<m;++i) h[i+1] = h[i]*BASE+text[i];
    int res = 0;
    for (int i=1;i<=m-k+1;++i) res += get_hash(i, i+k-1) == H;
    return res;
}
int main()
{
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    cin >> n >> q; ht = ceil(log2(n));
    grp = vvp(n);
    for (int i=1,u,v;i<n;++i) {
        char c; cin >> u >> v >> c; u--; v--;
        grp[u].eb(v, int(c-'a')); grp[v].eb(u, int(c-'a'));
    }
    dfs(0, n);
    vector<Query> queries(q);
    vector<vvp> mnt(2, vvp(n));
    for (auto& [u, v, lca, pos] : queries) {
        static int qid = 0;
        string _let;
        cin >> u >> v >> _let; u--; v--;
        int len = _let.length();
        bsi let;
        for (int i=0;i<len;++i) let.pb(_let[i]-'a');
        lca = getLca(u, v);
        acam[0].insert(let, pos[0]); reverse(allu(let)); acam[1].insert(let, pos[1]);
        if (lca != u && lca != v) {
            bsi s = extract(u, v, lca, len);
            cout << solve_passing(s, let) << "\n";
        } else {
            if (dep[u]-dep[lca] >= len) mnt[0][u].eb(qid, 1), mnt[0][jump(u, dep[u]-dep[lca]-len+1)].eb(qid, -1);
            if (dep[v]-dep[lca] >= len) mnt[1][v].eb(qid, 1), mnt[1][jump(v, dep[v]-dep[lca]-len+1)].eb(qid, -1);
        }
    }
    acam[0].build(), acam[1].build();
    static int ans[N + 5];
    auto dfs2 = [&](auto self, int u, int Fu, vi cur) {
        for (int i:{0,1}) acam[i].upd(cur[i], 1);
        for (const auto& [v, ignore] : grp[u]) {
        }
    };
    dfs2(dfs2, 0, n, {0, 0});
    for (int i=0;i<q;++i) cout << ans[i] << "\n";
}
```