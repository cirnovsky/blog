---
date: '2023-10-29'
title: 'Solution Set -「JOISC 2021」'
category: 'Notes'
---

## Desc.

&emsp;&emsp;[Link.](https://loj.ac/p/3495)

&emsp;&emsp;给出一棵大小为 $n$ 的树, 记 $f(S)$ 表示, 令点集 $S$ 中的点的点权为 $1$, 其余为 $0$, 树的带权重心数量. 求 $\max_{|S| = i}$.

## Sol.

&emsp;&emsp;由带权重心的性质, 所有重心处于树上的同一条路径. 且该路径上不存在带权点 (就本题而言). 则路径的两端点的带权子树大小相等且等于 $\frac{|S|}2$.

&emsp;&emsp;那么使用点分治, 对于当前分治子树的后继节点的子树, 求出 $w_s$ 表示该后继节点子树中子树所有大小为 $s$ 的节点中到当前分治重心的距离的最大值, $pre_s$ 表示 $w_s$ 在处理过的子树中的前大值. 但注意, 带权点并没有确定, 因此我们并不能直接用 $w$ 和 $pre$ 来求答案.

&emsp;&emsp;上述问题的解决方法其实很简单, 只要对 $w_s$ 做个后缀 $\max$ 即可, 即在 $\geqslant \frac{|S|}2$ 的子树中找最优解.

```cpp
int n, sz[200100], w[200100], pre[200100], ans[200100];
bool rm[200100];
vi grp[200100];
int root(int u, int Fu, int all) {
    int r = n, ok = sz[u] = 1;
    for (int v : grp[u])
        if (v != Fu && !rm[v]) {
            int rs = root(v, u, all);
            if (rs < n) r = rs;
            if (sz[v]*2 > all) ok = 0;
            sz[u] += sz[v];
        }
    return ok && ((all-sz[u])*2 <= all) ? u : r;
}
void dfs(int u, int Fu, int d) {
    sz[u] = 1;
    for (int v : grp[u])
        if (v != Fu && !rm[v]) dfs(v, u, d+1), sz[u] += sz[v];
    chkmax(w[sz[u]], d);
}
void solve(int u) {
    rm[u] = 1;
    int h = 0;
    reverse(allu(grp[u]));
    for (int v : grp[u])
        if (!rm[v]) {
            dfs(v, u, 1);
            for (int i=sz[v];i>=1;--i) chkmax(w[i], w[i+1]), chkmax(ans[i*2], w[i]+pre[i]);
            for (int i=1;i<=sz[v];++i) chkmax(pre[i], w[i]), w[i] = 0;
            chkmax(h, sz[v]);
        }
    for (int i=1;i<=h;++i) pre[i] = 0;
    for (int v : grp[u])
        if (!rm[v]) solve(root(v, n, sz[v]));
}
int main() {
    ios::sync_with_stdio(0);
    IN.tie(nullptr);
    IN > n;
    for (int i=1,u,v;i<n;++i) {
        IN > u > v; u--; v--;
        grp[u].pb(v), grp[v].pb(u);
    }
    solve(root(0, n, n));
    transform(ans+1, ans+n+1, ans+1, [&](int x) { return x+1; });
    copy_n(ans+1, n, ostream_iterator<int>{cout, "\n"});
}
```

---

> / 我們這些沙沙作響的葉子有回應風暴的聲音，而你是誰，如此安靜？ /
>
> / 我不過是一朵花。 /
> 
> / "<span class="font-variant:small-caps">We</span>, the rustling leaves, have a voice that answers the storms, but who are you so silent?" /
> 
> / "I am a mere flower." /
>
> —— [Rabindranath Tagore - *Stray Birds*](https://zh.wikipedia.org/zh-tw/%E6%BC%82%E9%B3%A5%E9%9B%86)