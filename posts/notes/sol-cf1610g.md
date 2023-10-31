---
date: '2023-10-11'
title: 'Solution -「CF 1610G」AmShZ Wins a Bet'
category: 'Notes'
---

## Desc.

[Link.](http://codeforces.com/problemset/problem/1610/G)

给出一个括号序列, 在一次操作中, 你可以:

- 选择一对匹配的括号, 将他们从原序列中删去.

请你规划每次操作, 使得若干次操作后得到的序列字典序最小.

## Sol.

**结论:** 如果删除了 $i, j$, 那么 $(i, j)$ 一定被删除了.

证明考虑对 $s_{i+1}$ 分类讨论即可.

设 $f_i$ 表示从 $i$ 出发的最近合法括号序列的右端点, $g_i$ 表示考虑 $[i, n]$ 的答案. 转移有

$$
g_i = \begin{cases}
\mathrm{CONCAT}(s_i, g_{i+1}) \\
\min(\mathrm{CONCAT}(s_i, g_{i+1}), g_{f_i+1})
\end{cases}
$$

直接 DP 由于值域的处理需要 $\mathcal O(n)$ 的时间, 所以是 $\mathcal O(n^2)$ 的. 考虑用数据结构处理, 就是要支持如下的问题: 

>给定一个字符串, 支持
>
> - 新增版本, 并在旧版本字符串的前面添加一个字符;
>
> - 比较版本 $i, j$ 的字典序大小.

其中比较操作可以转化为求 LCP (Longest Common Prefix). 求解 LCP 的一个常见方式是二分 + Hash. 然而这样我们需要维护一个字符串的所有前缀 Hash 值, 显然不如直接比较. 我们是否可以不维护所有前缀呢? 当然可以, 我们仅存储 $h_{s, j}$ 表示字符串 $s$ 前 $2^j$ 位的 Hash 值即可. 那么二分就变成了倍增. 具体来说, 维护 $g_i$ 第 $2^j$ 位在原串中的位置和前缀 Hash 值即可.

```cpp
/*=cirnovsky=*/
#include <bits/stdc++.h>
using namespace std;
using ull = unsigned long long;
const int N = 3e5;
const ull BASE = 1331;
int f[N + 5], g[N + 5], pos[21][N + 5], h[21][N + 5];
ull pw[N + 5];
static void* __tmp = ([]() {
    pw[0] = 1; for (int i=1;i<N+5;++i) pw[i] = pw[i-1]*BASE;
    return pw;
 })();
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    string s; cin >> s;
    int n = s.length();
    stack<int> stk;
    for (int i=0;i<n;++i) {
        if (s[i] == '(') stk.push(i);
        else if (!stk.empty()) f[stk.top()] = i+1, stk.pop();
    }
    pos[0][n] = g[n] = n;
    for (int i=n-1;i>=0;--i) {
        pos[0][i] = g[i+1], h[0][i] = s[i], g[i] = i;
        for (int j=1;j<=18;++j) pos[j][i] = pos[j-1][pos[j-1][i]];
        for (int j=1;j<=18;++j) h[j][i] = h[j-1][i]+h[j-1][pos[j-1][i]]*pw[1<<(j-1)];
        if (f[i]) {
            int x = i, y = g[f[i]];
            for (int j=18;j>=0;--j) if (h[j][x] == h[j][y]) x = pos[j][x], y = pos[j][y];
            if (y == n || s[x] > s[y]) g[i] = g[f[i]];
        }
    }
    for (int i=g[0];i<n;i=g[i+1]) cout << s[i];
    cout << "\n";
}
```

---

> / 将 诗句通通掰碎 捡一双含情眉 /
>
> / 如何形容她？讽刺来得卑微 歌颂不够尖锐 /
>
> / 然后看向她 红唇正在颓废 墓志太过宏伟 /
>
> / 最后告别她 用尽言辞虚伪 发酵一滴眼泪 /
>
> / 再忘却 她是谁 /
>
>—— [阿良良木键 - *乌云* ft. 乐正绫](https://vocadb.net/S/342021)