---
date: '2023-10-14'
title: 'Solution -「ARC 112E」Cigar Box'
category: 'Notes'
---

## Desc.

&emsp;&emsp;[Link.](https://atcoder.jp/contests/arc112/tasks/arc112_e)

&emsp;&emsp;给定目标排列 $Q = (p_1, \dots, p_n)$ 和初始排列 $P = (1, \dots, n)$. 你可以对初始排列进行如下操作:

- 选择一个下标 $i \in [1, n]$, 将其置于排列的开头或结尾.

&emsp;&emsp;问通过 $m$ 次操作将初始排列变化为目标排列的方案数, 对 $\textbf{998244353}$ 取模.

&emsp;&emsp;$n, m \leqslant 3000$.

## Sol.

&emsp;&emsp;发现对于每一个数, 我们只关心对它的最后一次操作. 枚举 $L$ 和 $R$ 分别表示将某个数移动到开头的**重要操作**数和将某个数移动到结尾的**重要操作**数, 那么考虑从 $P$ 到 $Q$ 的操作过程, 最终留在 $[L+1, N-R]$ 的数的相对顺序并没有改变, 因此 $Q$ 中的 $[L+1, N-R]$ 部分一定单调递增.

&emsp;&emsp;设 $f_{i, L, R}$ 表示已经填了操作序列的 $[i, m]$ 部分 [^1] 的, 前 $L$ 个数和后 $R$ 个数已经还原的方案数. 有如下转移:

$$
f_{i + 1, L, R} += f_{i, L, R} \times 2 \times (L + R) \\
f_{i + 1, L + 1, R} += f_{i, L, R} \\
f_{i + 1, L, R + 1} += f_{i, L, R}
$$

&emsp;&emsp;[TODO /阐释转移方程/]

&emsp;&emsp;后面还似懂非懂, 就不放出来误人子弟了...

[^1]: 为什么倒序进行 DP? 因为这样我们才能获得「当前操作是否**重要**」的信息.

```cpp
int main()
{
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    const int MOD = 998244353;
    using mint = modint<MOD>;
    int n, m; cin >> n >> m;
    vi a(n); rds(a);
    vector comb(n+1, vector<mint>(n+1));
    for (int i=0;i<=n;++i) {
        comb[i][0] = 1;
        for (int j=1;j<=i;++j) comb[i][j] = comb[i-1][j]+comb[i-1][j-1];
    }
    vector f(m+1, vector<mint>(n+1));
    f[0][0] = 1;
    for (int i=0;i<m;++i) {
        for (int j=0;j<=n;++j) {
            f[i+1][j] += f[i][j]*2*j;
            if (j < n) f[i+1][j+1] += f[i][j];
        }
    }
    mint ans = 0;
    for (int l=0;l<=n;++l) {
        for (int r=n-l;r>=0;--r) {
            if (n-l-r >= 2 && a[n-r-2] > a[n-r-1]) break;
            ans += f[m][l+r]*comb[l+r][l];
        }
    }
    cout << ans << "\n";
}
```

---

> 从未发觉 白昼已到尽头
> 
> 何时 我未留意的腐朽
> 
> 在暮雨之中尝试绽放
>
> —— [COP - *hello&bye, days* ft. 洛&乐](https://vocadb.net/S/109308)