---
date: 2022-07-25
title: 联训 1
category: notes
tags: [data-structures,hash]
---

[link。](http://www.accoders.com/contest.php?cid=4076)

> **B. eggache**：在序列中找出最长的极差 $\leqslant k$ 的子段，要求复杂度 $O(n)$。

增进对普及组级别的单调栈的理解。容易对单调队列陷入误区，认为它维护了一个上升 / 下降子序列，实则真的是「比你小还比你强的选手会把你淘汰」，并非可以形象理解。

单调队列维护最大值，队列中元素递减，最大值在队首取到，最小值同理。

回到这个题，我们考虑规划前缀，即枚举右端点，现在的目标是找到最小的左端点。维护递增和递减两个单调队列，则区间极差为两个队列队首的差。若队首差 $> k$ 则弹出两个队列的队首，每次弹出下标较小的（利用了最值性质）。

```cpp
int n, K, a[3000100], q[3000100], q2[3000100];
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    cin >> K >> n;
    for (int i=1; i<=n; ++i) {
        cin >> a[i];
    }
    int h = 1, t = 0, h2 = 1, t2 = 0, l = 1, ans = 0;
    for (int i=1; i<=n; ++i) {
        while (h <= t && a[q[t]] > a[i]) t--;
        while (h2 <= t2 && a[q2[t2]] < a[i]) t2--;
        q[++t] = q2[++t2] = i;
        while (a[q2[h2]]-a[q[h]] > K) {
            l++;
            while (q[h] < l) h++;
            while (q2[h2] < l) h2++;
        }
        cmax(ans, i-l+1);
    }
    cout << ans << "\n";
}
```

>**D. reverse**：整数序列，可以对前缀进行翻转操作，有些前缀不能操作，先翻长度小的再翻大的，问能得到的字典序最小的最终序列，要求复杂度 $O(n \log_2 n)$。

有一个重要的性质：

> **observation**：对于紧邻的两个可以操作的前缀 $i < j$，设 $i$ 已经最优决策过，$j$ 的最优决策为 $[1, i]+(i, j]$ 或 $\textit{rev}((i, j])+[1, i]$。

这个观察等价于局部最优的决策方案一定出现在全局最优决策方案中，证明比较简单，因为 $[1, i]$ 的形态只有字典序最大或者字典序最小，如果最大我们可以通过取消 / 实行一次翻转 $[1, i]$ 来调整（我觉得很神啊）。

还有一个厉害的理解方式，令 $f(i)$，$g(i)$ 分别表示前缀 $i$ 正向 / 反向字典序最优的方案，然后发现他们的转移都是 $\min{f_{i-1}+B, B'+g_{i-1}}$，其中 $B$ 是加入的字符串。

动态维护当前的最优方案，我们要支持的就是在头 / 尾插入字符串，判断两种决策哪个最优可以二分和哈希，所以还要维护哈希。

有种厉害的写法，直接在数组中间开始跑，然后动态维护，这样就不用写数据结构来维护了！

```cpp
const ull bas = 131;
ull hs[600100], pw[600100];
int n, m, a[300100], ans[600100], L, R;
bitset<300100> fd;
bool chk(int x, int y, int len) { // if x < y
    int l = 0, r = len, res = 0, mid;
    while (l <= r) {
        mid = (l+r)/2;
        if (hs[x+mid-1]-hs[x-1] == (hs[y+mid-1]-hs[y-1])*pw[x-y]) l = mid+1, res = mid;
        else r = mid-1;
    }
    return res == len || ans[x+res] < ans[y+res];
}
void add(int x) {
    ans[--L] = x;
    hs[L-1] = hs[L]-pw[L]*x;
}
void add2(int x) {
    ans[++R] = x;
    hs[R] = hs[R-1]+pw[R]*x;
}
void solve() {
    cin >> n >> m;
    for (int i=1; i<=n; ++i) {
        cin >> a[i];
    }
    for (int i=0,x; i<m; ++i) {
        cin >> x;
        fd.set(x);
    }
    ans[L = R = 300005] = a[1];
    hs[L-1] = 0, hs[L] = a[1]*pw[L];
    int lst = 1;
    for (int i=2; i<=n; ++i) {
        if (!fd.test(i)) {
            int tmp = L, tmp2 = R-L+1;
            for (int j=lst+1; j<=i; ++j) {
                add(a[j]), add2(a[j]);
            }
            if (chk(tmp, L, tmp2+i-lst)) {
                for (int t=i-lst; t--;) {
                    L++;
                }
            }
            else {
                for (int t=i-lst; t--;) {
                    R--;
                }
            }
            lst = i;
        }
    }
    while (lst < n) {
        add2(a[++lst]);
    }
    modint998244353 qwq = 0, now = 1;
    for (int i=L; i<=R; ++i) {
        qwq += now*ans[i], now *= 37;
    }
    cout << qwq.val() << "\n";
}
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    pw[0] = 1;
    for (int i=1; i<600100; ++i) {
        pw[i] = pw[i-1]*bas;
    }
    int tt;
    for (cin>>tt; tt--; fd.reset()) {
        solve();
    }
}
```
    