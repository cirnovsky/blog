---
date: '2023-11-01'
title: 'Solution -「JOISC 2023」議会'
---

## Desc.

[Link.](https://loj.ac/p/3970)

给出 $n$ 个最高位不超过 $m$ 二进制数, 对于每个 $i \in [1, n]$, 找到一个 $j \neq i$, 使得删去 $i$ 和 $j$ 后, 满足票数超过 $\lfloor \frac n2 \rfloor$ 的数位数最大. 某个二进制数的某一位为 $1$ 就相当于给这一位投票.

$3 \leqslant n \leqslant 3\times 10^5$, $1 \leqslant m \leqslant 20$.

## Sol.

**这篇题解写得很玄学, 不好理解, 建议不看.**

考虑如下暴力:

```cpp[class="line-numbers"][class="line-numbers"]
int n, m, s[300100], cnt[30];
int main() {
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    cin >> n >> m;
    for (int i=0,x;i<n;++i)
        for (int j=0;j<m;++j) {
            cin >> x;
            s[i] |= x<<j;
            cnt[j] += x;
        }
    for (int i=0;i<n;++i) { // enumerating chairman
        for (int j=0;j<m;++j) cnt[j] -= s[i]>>j&1;
        int ans = 0;
        for (int j=0;j<m;++j) ans += cnt[j] >= n/2;
        int sw = 0; // set waiting to be determined
        for (int j=0;j<m;++j)
            sw |= (cnt[j] == n/2)<<j;
        int ext = 233;
        for (int j=0;j<n;++j)
            if (j != i) chkmin(ext, __builtin_popcount(s[j]&sw));
        cout << ans-ext << "\n";
        for (int j=0;j<m;++j) cnt[j] += s[i]>>j&1;
    }
}
```

那么问题转化为, 对于 $S$, 求 $\min\{\mid S \cup T_i \mid\}$, 将 $T_i$ 取补集, 则求 $\max\{\mid S\cup T_i\mid\}$. 令 $g_S$ 表示与 $S$ 的交集最大的 $T_i$ 的 $i$. 由于交集一定是 $S$ 的子集, 因此可以从子集转移过来. 很难说, 只能意会, DJ 给我讲了半天才懂.

大概是, 首先求出 $S$ 的某个超集的编号, 这个可以直接用超集和. 然后以这个为初值, 求解上述的 DP. 当然, 正确的思考顺序是为了上面的 DP 构造初值, 这才是我们的 Motivation.

```cpp[class="line-numbers"][class="line-numbers"]
int n, m, s[300100], cnt[30];
int f[1<<20], g[1<<20];
int main() {
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    cin >> n >> m;
    memset(f, -1, sizeof f);
    memset(g, -1, sizeof g);
    for (int i=0;i<n;++i) {
        for (int j=0,x;j<m;++j) {
            cin >> x;
            cnt[j] += x;
            s[i] |= (x^1)<<j;
        }
        if (f[s[i]] == -1) f[s[i]] = i;
        else g[s[i]] = i;
    }
    // == computing f[i], such that @i \in @s[f[i]]
    for (int i=(1<<m)-1;i>=0;--i) {
        for (int j=0;j<m;++j) {
            if (!(i&(1<<j))) {
                int ni = i|(1<<j);
                if (f[i] == -1) {
                    f[i] = f[ni];
                    if (g[ni] != f[i] && g[i] == -1) g[i] = g[ni];
                } else {
                    if (f[i] != f[ni] && g[i] == -1) g[i] = f[ni];
                    else if (f[i] != g[ni] && g[i] == -1) g[i] = g[ni];
                }
            }
        }
    }
    // == end computing f[i]
    // == computing f[i], such that |i&s[f[i]]| is max
    for (int i=0;i<1<<m;++i) {
        for (int j=0;j<m;++j) {
            if (i&(1<<j)) {
                int ni = i^(1<<j);
                vi v;
                for (int x : {f[i], g[i], f[ni], g[ni]})
                    if (x > -1) v.pb(x);
                if (v.empty()) continue;
                sort(v.begin(), v.end(), [&](int x, int y) {
                    return __builtin_popcount(s[x]&i) > __builtin_popcount(s[y]&i);
                });
                v.erase(unique(v.begin(), v.end()), v.end());
                f[i] = v[0];
                if ((int) v.size() > 1) g[i] = v[1];
            }
        }
    }
    // == end computing f[i]
    for (int i=0;i<n;++i) {
        for (int j=0;j<m;++j) cnt[j] -= !(s[i]>>j&1);
        int ans = 0, cur = 0;
        for (int j=0;j<m;++j) ans += cnt[j] > n/2;
        for (int j=0;j<m;++j) cur |= (cnt[j] == n/2)<<j;
        if (i == f[cur]) ans += __builtin_popcount(cur&s[g[cur]]);
        else ans += __builtin_popcount(cur&s[f[cur]]);
        cout << ans << "\n";
        for (int j=0;j<m;++j) cnt[j] += !(s[i]>>j&1);
    }
}
```

---

>/ 板斜尿流急，坑深屎落迟。/
>
>—— [梁实秋 - *忆清华 [上]*](https://s.bailushuyuan.org/novel/traditional/chapters/123805)