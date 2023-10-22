---
date: '2023-10-22'
title: 'Solution -「ABC 309G」Ban Permutation'
category: 'Notes'
---

## Desc.

&emsp;&emsp;[Link.](https://atcoder.jp/contests/abc309/tasks/abc309_g)

&emsp;&emsp;求出满足如下条件的 $1$ 到 $n$ 的排列数量 (记排列为 $P = (p_1, \dots, p_n))$:

- $\forall i \in [1, n]$, 有 $\mid p_i-i\mid \geqslant X$.

&emsp;&emsp;$1 \leqslant n \leqslant 100$, $1 \leqslant X \leqslant 5$.

## Sol.

&emsp;&emsp;$X$ 很小, 从这里入手. 注意到 $\geqslant X$ 的状态可能有很多, 但 $< X$ 的状态比较少, 因此计算补集. 考虑容斥, 设 $g_i$ 表示有 $i$ 个数不合法, 剩余数随意放置的方案数, $f_i$ 为恰好 $i$ 个不合法, 剩余数均合法的方案数. 有:
$$
g_i = \sum_{j=i}^n f_j \times \binom ji
$$
&emsp;&emsp;由二项式反演:
$$
f_i = \sum_{j=i}^n (-1)^{j-i} \times \binom ji \times g_j
$$
&emsp;&emsp;答案即为 $\displaystyle f_0 = \sum_{i=0}^n (-1)^i \times g_i$. 考虑怎么求 $g_i$. 设 $f_{i, j, s}$ 表示前 $i$ 个位置有 $j$ 个不合法, 其余位置**不纳入考虑**[^1], 且第 $i$ 个数的不合法区间当前的被占用情况为 $s$ 的方案数. 转移分当前数是否加入不合法讨论即可, 具体可以看代码.

```cpp
int main() {
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    const int MOD = 998244353;
    using mint = modint<MOD>;
    int n, X; cin >> n >> X;
    const int LIM = 1<<(2*X-1), U = LIM-1;
    vector f(n+1, vector(n+1, vector<mint>(LIM)));
    f[0][0][0] = 1;
    for (int i=0;i<n;++i) {
        for (int j=0;j<=i;++j) {
            for (int s=0;s<LIM;++s) {
                f[i+1][j][s>>1] += f[i][j][s];
                for (int p=0;p<2*X-1;++p)
                    if (!((s>>1)&(1<<p)) && i+2-X+p >= 1 && i+2-X+p <= n)
                        f[i+1][j+1][(s>>1)|(1<<p)] += f[i][j][s];
            }
        }
    }
    vector<mint> g(n+1), facs(n+1);
    facs[0] = 1;
    for (int i=1;i<=n;++i)
        facs[i] = facs[i-1]*i;
    for (int i=0;i<=n;++i)
        g[i] = accumulate(allu(f[n][i]), mint(0));
    mint ans = 0;
    for (int i=0;i<=n;++i)
        ans += (i&1?MOD-1:1)*g[i]*facs[n-i];
    cout << ans << "\n";
}
```

---

>/ 来不及拒绝 /
>
>/ 黑与白的纯洁 /
>
>/ 视而不见 /
>
>/ 假装不见 /
>
>/ 凝望成永别 /
>
>—— [Zeno - *D!SCOLOЯ* ft. 星尘](https://vocadb.net/S/147283)

[^1]: 为什么其余位置不纳入考虑? 因为随意放置的方案数可以通过乘阶乘计算, 放入 DP 的计算里会很麻烦!
