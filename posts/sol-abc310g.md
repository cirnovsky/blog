---
date: '2023-10-20'
title: 'Solution -「ABC 310G」Takahashi And Pass-The-Ball Game'
category: 'Notes'
---

## Desc.

&emsp;&emsp;[Link.](https://atcoder.jp/contests/abc310/tasks/abc310_g)

&emsp;&emsp;有 $n$ 个二元组, 用 $(a_i, t_i)$ 描述. 等概率在 $[1, k] \bigcap \mathbb{N}^*$ 中选取一个 $x$, 执行以下操作 $x$ 次:

- 取一空数组 $\{b_n\}$, 令 $\displaystyle b_i = \sum_{t_j = i} a_j$, 然后再用 $b_i$ 替换每个 $a_i$;

&emsp;&emsp;问最终 $a_i$ 的期望值对 $\mathbf{998244353}$ 取模的结果;

&emsp;&emsp;$1\leqslant n \leqslant 2 \times 10^5$, $1 \leqslant k \leqslant 10^{18}$, $k$ is not a multiple of $\mathbf{998244353}$.

## Sol.

&emsp;&emsp;令 $\mathbf A = \left( \begin{matrix} a_1, \dots, a_n \end{matrix}\right)$, $\mathbf T = \left (\begin{matrix} 0/1 & \cdots  & 0/1 \\ \vdots & \ddots & \vdots \\ 0/1 & \cdots & 0/1 \end{matrix}\right)$, 其中 $\mathbf T_{i, t_i} = 1$, 其余为 $0$. 则答案为 (以下均省去 $\frac 1k$ 不写):
$$
f(\mathbf A, \mathbf T, k) = \sum_{i=1}^k \mathbf A \times \mathbf T^i
$$
&emsp;&emsp;进行分治处理 (以下忽略 $\frac 1k$ 的系数).

$$
\begin{aligned}
&f(\mathbf A, \mathbf T, 2m)\\
={} & \mathbf A\times \mathbf T + (\mathbf A \times \mathbf T^2) + \dots + (\mathbf A \times \mathbf T ^{2m}) \\
={} & f(\mathbf A\mathbf T+\mathbf A\mathbf T^2, \mathbf T^2, m)
\end{aligned}
$$
&emsp;&emsp;对于 $k$ 为奇数的情况：
$$
\begin{aligned}
&f(\mathbf A, \mathbf T, k)\\
={}& \mathbf A+f(\mathbf A \mathbf T, \mathbf T, k-1)
\end{aligned}
$$
&emsp;&emsp;于是我们用 $\mathcal O(n\log k)$ 的时间解决了问题. 当然亦可以建出内向基环树.

```cpp
int main()
{
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    int n; ll k; cin >> n >> k;
    const int MOD = 998244353;
    using mint = modint<MOD>;
    using vm = vector<mint>;
    vi tmp(n), T(n); rds(T), rds(tmp);
    vm A(n);
    transform(allu(T), T.begin(), [&](int x) { return x-1; });
    transform(allu(tmp), A.begin(), [&](ll x) { return x%MOD; });
    const auto add = [&](const vm& lhs, const vm& rhs) {
        vm res(n);
        for (int i=0;i<n;++i) res[i] = lhs[i]+rhs[i];
        return res;
    };
    const auto mul = [&](const vm& lhs, const vi& to) {
        vm res(n);
        for (int i=0;i<n;++i) res[to[i]] += lhs[i];
        return res;
    };
    const auto trans = [&](const vi& v) {
        vi res(n);
        for (int i=0;i<n;++i) res[i] = v[v[i]];
        return res;
    };
    vm res(n);
    ll tmp_k = k%MOD;
    A = mul(A, T);
    while (k) {
        if (k&1) res = add(res, A), A = mul(A, T);
        A = add(A, mul(A, T));
        T = trans(T);
        k /= 2;
    }
    mint inv = 1/mint(tmp_k);
    for (int i=0;i<n;++i) cout << res[i]*inv << " \n"[i == n-1];
}
```

---

> / 相处的时间 你我已命运相连 /
>
> / 音乐频率凋谢 默契超越一切 /
>
> / 已记不清有多少个深夜你独自伏案桌前 /
>
> / 彻夜无眠 只为让我更耀眼 /
>
> —— [Kide - *星愿* ft. 星尘](https://vocadb.net/S/115641)