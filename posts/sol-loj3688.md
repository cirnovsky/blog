---
date: '2023-10-15'
title: 'Solution -「JOISC 2022」コピー & ペースト 3'
category: 'Notes'
---

## Desc.

&emsp;&emsp;[Link.](https://loj.ac/p/3688)

&emsp;&emsp;你有两个字符串 $S$ 和 $T$, 初始为空. 每次你可以进行以下三种操作中的一种:

1.  选定**小写字母** $c$, 令 $S := S+c$;
2. 令 $T := S$, 令 $S:=\texttt{""}$;
3. 令 $S := S+T$.

&emsp;&emsp;三种操作分别花费 $A, B, C$, 现要求你将 $S$ 转化为目标串 $X$, 求最小花费.

&emsp;&emsp;$1\leqslant |X| \leqslant 2.5\times 10^{3}$, $\Sigma = \{\texttt{a}, \dots, \texttt{z}\}$.

## Sol.

&emsp;&emsp;今天真调了一天 RE, 人麻了. 😅

&emsp;&emsp;考虑区间 DP, 设 $f_{l, r}$ 表示达成 $X[l, r)$ 的最小花费. 操作 1 的转移很简单:
$$
f_{l, r}+A \rightarrow f_{l-1, r} \\
f_{l, r}+A \rightarrow f_{l, r+1}
$$
&emsp;&emsp;其中 $\rightarrow$ 表示更新, 即取最小值. 可以发现操作 2 比较有性质, 因为每次执行操作 2 都可以「刷新」当前字符串的状态. 设当前这次操作 2 后, $T$ 变成了 $Y$, 那么后面若干次操作中, 我们会使用操作 1&2, 来使 $S$ 变成类似 $\texttt{...}Y\texttt{...}YY\texttt{...}Y\texttt{...}$ 的形状, 其中省略号代表操作 1 插入的字母. 所以如果考虑从 $f_{l, r}$ 转移到 $f_{x, y}$ ($x \leqslant l <r \leqslant y$), 那么有 $X[x, x+r-l)=X_[y-r+l, y) = X[l, r)$. 并且三个字符串无交.

&emsp;&emsp;剩下的后面再写吧... 先睡个觉,

```cpp
int main() {
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    const ull BASE = 1331;
    int n; cin >> n;
    vector<ull> pw(n+1), hs(n+1);
    pw[0] = 1;
    for (int i=1;i<=n;++i) pw[i] = pw[i-1]*BASE;
    string s; cin >> s;
    ll A, B, C; cin >> A >> B >> C;
    for (int i=0;i<n;++i) hs[i+1] = hs[i]*BASE+s[i]-'a'+1;
    const auto get_hash = [&](int l, int r) { return hs[r]-hs[l]*pw[r-l]; };
    vector pos(n, vi(n+1)); // pos[l][r] = Latest @i such that i+r-l <= l, s[i, i+r-l) == s[l, r)
    unordered_map<ull, int> latest;
    for (int d=1;d<=n;++d) {
        latest.clear();
        for (int r=d;r<=n;++r) {
            int l = r-d;
            if (l-d >= 0) latest[get_hash(l-d, l)] = l-d;
            auto h = get_hash(l, r);
            if (latest.find(h) != latest.end()) pos[l][r] = latest[h];
            else pos[l][r] = -1;
        }
    }
    const ll INF = 1.01e18;
    vector dp(n, vector(n+1, INF));
    for (int i=0;i<n;++i) dp.at(i).at(i+1) = A;
    for (int d=1;d<n;++d) {
        for (int l=0,r=d;r<=n;++l,++r) {
            if (l > 0) chkmin(dp.at(l-1).at(r), dp.at(l).at(r)+A);
            if (r < n) chkmin(dp.at(l).at(r+1), dp.at(l).at(r)+A);
            int p = pos[l][r], cnt = 2;
            while (p >= 0) {
                chkmin(dp.at(p).at(r), dp.at(l).at(r)+B+cnt*C+(r-p-cnt*(r-l))*A);
                cnt++;
                p = pos[p][p+r-l];
            }
        }
    }
    cout << dp.at(0).at(n) << "\n";
}
```

---

>/ この世界で風に揺れてそこに在った /
>
>/ *在这个世界被风摇动 留在那处* /
>
>/ 君の飲み残しのような人生を /
>
>/ *你残饮半盏一般的人生* /
>
>/ 背負って生き続ける僕の身にもなれ /
>
>/ *我变为背负着它活下去的此身* /
>
>/ 君が諦めてしまった世界で /
>
>/ *在你放弃了的这个世界* /
>
>/ 一文にもならない懺悔を続けている /
>
>/ *坚持着一文不值的惭愧* /
>
>—— [傘村トータ - *小説　夏と罰 (下)* ft. 猫村いろは](https://vocadb.net/S/245048)