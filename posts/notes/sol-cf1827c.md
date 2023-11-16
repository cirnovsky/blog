---
date: '2023-10-18'
title: 'Solution -「CF 1827C」Palindrome Partition'

---

## Desc.

[Link.](https://codeforces.com/problemset/problem/1827/C)

定义**好串**为一个或多个偶回文串拼接的结果. 给出一个字符串, 求其为**好串**的子串数.

## Sol.

考试的时候犯病了, 求 $f_i$ 居然没有想到任何字符串算法, 而去连边写成了图论题... 有点离谱. 🤔

容易想到一个 DP, 设 $f_i$ 表示在 $i$ 结尾的极短偶回文串的长度, $g_i$ 表示在 $i$ 结尾的好串数量, 有 $g$ 的转移:
$$
g_i = g_{i-f_i}+1
$$
若 $f_i$ 不存在则为 $0$. 接下来考虑怎么求 $f_i$.

我们先求出 $rad_i$ 表示以**间隔** $i$ 为中心的回文串长度, 这个可以用各种姿势求, 比如二分 & 哈希, PAM, Manacher etc. 然后发现 $f_i$ 可以用一个 $rad_j$ 来更新, 其中 $j < i, j+rad_j \geqslant i$. 我们肯定希望 $i$ 和 $j$ 靠得越近越好. 于是倒着扫描, 用并查集维护连续段, 以 $rad_i$ 更新连续段. 这个有点没说清楚, 具体可以看代码, 代码应该会更好理解.

```cpp
void solve() {
    int n; string tmp, s; cin >> n >> tmp;
    for (int i=0;i<n;++i) s.pb(tmp[i]), s.pb('|');
    s.pop_back();
    const int m = 2*n-1;
    const ull BASE = 1331;
    vector<ull> pw(m);
    vector hs(2, vector<ull>(m+1));
    pw[0] = 1;
    for (int i=1;i<m;++i) pw[i] = pw[i-1]*BASE;
    for (int i=0;i<m;++i) hs[0][i+1] = hs[0][i]*BASE+s[i]-'a'+1;
    for (int i=m-1;i>=0;--i) hs[1][i] = hs[1][i+1]*BASE+s[i]-'a'+1;
    const auto getHash = [&](int l, int r, int idx) {
        if (idx == 0) return hs[0][r]-hs[0][l]*pw[r-l];
        return hs[1][l]-hs[1][r]*pw[r-l];
    };
    vi rad(m);
    for (int i=0;i<m;++i) {
        int l = 0, r = min(i, m-i-1), res = 0;
        while (l <= r) {
            int mid = (l+r)/2;
            if (getHash(i-mid, i, 0) == getHash(i+1, i+mid+1, 1)) l = mid+1, res = mid;
            else r = mid-1;
        }
        rad[i] = res;
    }
    vi fa(m);
    iota(allu(fa), 0);
    const auto find = [&](int u) {
        while (u != fa[u]) u = fa[u] = fa[fa[u]];
        return u;
    };
    vi f(n);
    for (int i=m-2;i>=0;i-=2) {
        for (int j;(j=find(i+rad[i]))>=i;) {
            if (j%2 == 0) f[j/2] = (j-i+1)/2;
            fa[j] = j-1;
        }
    }
    vll g(n);
    for (int i=0;i<n;++i)
        if (f[i]) {
            if (i/2 >= f[i]) g[i] = g[i-2*f[i]]+1;
            else g[i] = 1;
        }
    cout << accumulate(allu(g), 0ll) << "\n";
}
```

----

> / 光与影　是否不该在这一刻相逢 /
>
> / 而你和我从来谁也不是谁的附庸 /
>
> / 我放逐自己残缺的魂魄 /
>
> / 在镜子背面那一国 /
>
> / 一路上从没有挽留过 /
>
> / 那些徒劳奔波　却不曾完整的我 /
>
> —— [Kide - *零和 Zero-Sum* ft. Minus](https://vocadb.net/S/291185/)