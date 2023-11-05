---
date: '2023-10-15'
title: 'Solution -「JOISC 2022」コピー & ペースト 3'

---

## Desc.

[Link.](https://loj.ac/p/3688)

你有两个字符串 $S$ 和 $T$, 初始为空. 每次你可以进行以下三种操作中的一种:

1.  选定**小写字母** $c$, 令 $S := S+c$;
2. 令 $T := S$, 令 $S:=\texttt{""}$;
3. 令 $S := S+T$.

三种操作分别花费 $A, B, C$, 现要求你将 $S$ 转化为目标串 $X$, 求最小花费.

$1\leqslant |X| \leqslant 2.5\times 10^{3}$, $\Sigma = \{\texttt{a}, \dots, \texttt{z}\}$.

## Sol.

今天真调了一天 RE, 人麻了. 😅

考虑区间 DP, 设 $f_{l, r}$ 表示达成 $X[l, r)$ 的最小花费. 操作 1 的转移很简单:
$$
f_{l, r}+A \rightarrow f_{l-1, r} \\
f_{l, r}+A \rightarrow f_{l, r+1}
$$
其中 $\rightarrow$ 表示更新, 即取最小值. 可以发现操作 2 比较有性质, 因为每次执行操作 2 都可以「刷新」当前字符串的状态. 设当前这次操作 2 后, $T$ 变成了 $Y$, 那么后面若干次操作中, 我们会使用操作 2&3, 来使 $S$ 变成类似 $\texttt{...}Y\texttt{...}YY\texttt{...}Y\texttt{...}$ 的形状, 其中省略号代表操作 1 插入的字母. 所以如果考虑从 $f_{l, r}$ 转移到 $f_{x, y}$ ($x \leqslant l <r \leqslant y$), 那么有 $X[x, x+r-l)=X_[y-r+l, y) = X[l, r)$. 并且这三个部分无交. 我们可以这样钦定 $X[x, y)$ 的两端一定等于 $X[l, r)$ 的原因是, 上述形式两边多出来的字母可以通过第一种操作转移到.

具体转移的路径是从 $f_{l, r}$ 转移到 $f_{i, r}$, 其中 $X[i, i+r-l) = X[l, r]$ 且 $i+r-l \leqslant l$. 令 $cnt$ 表示 $X[i, r)$ 中最多可选出的子串个数, 使得这些子串都等于 $X[l, r)$ 且互相不交, 则转移的方程可以写为:

$$
f_{l, r} + B + cnt \times C + (r - i - cnt \times (r - l)) \times A \rightarrow f_{i, r}
$$

这样的复杂度最坏可以达到 $\mathcal O(n^3)$. 接下来引出一个优化复杂度的重要性质:

- 若存在两个下标 $i$ 和 $j$, 满足可以从 $f_{l, r}$ 转移到 $f_{i, r}$ 和 $f_{j, r}$, 并且 $i+r-l > j$ (即有交), 那么我们**只需要**转移到 $j$ 即可!

为什么? 因为 $f_{i, r}$ 可以被 $f_{j, r}$ 以同样的代价更新 (注意从 $f_{j, r}$ 到 $f_{i, r}$ 的更新能且仅能使用操作 1)! 比如 $X = \texttt{ababaccaba}$, 取最右边的 $\texttt{aba}$ 作为当前的模式串, 花费 $\texttt{ba}$ 到 $\texttt{aba}$ 和从 $\texttt{aba}$ 花费 $\texttt{ab}$ 都可以以同样的代价到达 $\texttt{aba}$.

那么我们每次转移就只剩下 $\mathcal O(\frac{l}{r-l})$ 次了, 加起来就是调和级数. 预处理 $p_{l, r}$ 表示 $X[0, l)$ 中最后出现的 $X[l, r)$ 位置即可.

```cpp[class="line-numbers"]
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

>/ With a handshake /
>
>/ Or an embrace /
>
>/ Or a kiss on the cheek /
>
>/ Possibly, all three /
>
>—— [American Football - *The Summer Ends*](https://www.youtube.com/watch?v=GNITmXTI5-Y)