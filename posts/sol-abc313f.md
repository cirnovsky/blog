---
date: '2023-10-12'
title: 'Solution -「ABC 313F」Flip Machines'
category: 'Notes'
---

## Desc.

&emsp;&emsp;[Link.](https://atcoder.jp/contests/abc313/tasks/abc313_f)

&emsp;&emsp;有 $N$ 张卡片，第 $i$ 张卡片正面印着一个数 $A_i$，反面印着一个数 $B_i$。一开始所有数正面朝上。

&emsp;&emsp;有 $M$ 种操作，第 $i$ 种操作表示为：

- 有 $50\%$ 的概率将卡片 $X_i$ 翻转，否则将 $Y_i$ 翻转。

&emsp;&emsp;要求你求一个集合 $S\subseteq \mathbb{N} \bigcap [1,m]$，使得进行了集合中所有的编号的操作之后正面朝上的所有数的和的期望最大。输出这个最大值。

## Sol.

&emsp;&emsp;容易发现有概率被任意正数台机器翻转的卡片对答案的贡献是 $\frac{a_i+b_i}{2}$, 其他卡片的贡献是 $a_i$. 将卡片分为两个集合 $A$ 和 $B$, 其中 $\forall i \in A$ 有 $a_i > b_i$, $\forall i \in B$ 有 $a_i \leqslant b_i$. 把一台机器的操作 $(x_i, y_i)$ 分为三个集合 $P, Q$ 和 $X$, 其中 $P$ 中的边只涉及 $A$ 内的卡片, $Q$ 中的边只涉及 $B$ 中的卡片, $X$ 中的边同时涉及两边的卡片. $P$ 中的边一定不会连, $Q$ 中的边一定会连, 留给我们决策的是 $X$ 中的边.

&emsp;&emsp;分类讨论 $|A|$ 和 $|B|$ 的相对大小:

- $|A| > |B|$:

&emsp;&emsp;此时 $|B|<\frac n2$, 采取以下的动态规划, 设 $f_{i, S}$ 表示 $A$ 中的前 $i$ 个点与 $B$ 的点集 $S$ 有连边的最大期望答案. 有转移
$$
f_{i, S}\rightarrow f_{i+1, S\cup\{j\}}
$$

- $|A| \leqslant |B|$:

&emsp;&emsp;朴素的应用搜索即可.

&emsp;&emsp;代码有点脑溢血, 抄了官方题解的实现.

```cpp
int main()
{
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vi a(n), b(n), u(m), v(m);
    for (int i=0;i<n;++i) cin >> a[i] >> b[i];
    for (int i=0;i<m;++i) cin >> u[i] >> v[i];
    for (int i=0;i<m;++i) u[i]--, v[i]--;
    for (int i=0;i<m;++i) {
        if (u[i] == v[i] && a[u[i]] < b[u[i]]) swap(a[u[i]], b[u[i]]);
    }
    int ans = 0;
    vi A, B, id(n);
    for (int i=0;i<n;++i) {
        ans += a[i]*2;
        if (a[i] >= b[i]) id[i] = A.size(), A.pb(a[i]-b[i]);
        else id[i] = B.size(), B.pb(b[i]-a[i]);
    }
    int nA = A.size(), nB = B.size();
    vector<ll> ls(nA);
    const int INF = 1e9;
    for (int i=0;i<m;++i) {
        bool xp = a[u[i]] >= b[u[i]],
             yp = a[v[i]] >= b[v[i]];
        if (xp == yp) {
            if (!xp) {
                ans += B[id[u[i]]]+B[id[v[i]]];
                B[id[u[i]]] = B[id[v[i]]] = 0;
            }
               
        } else {
            if (!xp) swap(u[i], v[i]);
            ls[id[u[i]]] |= 1ll<<id[v[i]];
        }
    }
    if (nA <= nB) {
        int opt = 0;
        for (int i=0;i<1<<nA;++i) {
            int cur = 0; ll st = 0;
            for (int j=0;j<nA;++j) if (i&(1<<j)) cur -= A[j], st |= ls[j];
            for (int j=0;j<nB;++j) if (st&(1ll<<j)) cur += B[j];
            chkmax(opt, cur);
        }
        ans += opt;
    } else {
        vector dp(nA+1, vi(1<<nB, -INF));
        dp[0][0] = 0;
        for (int i=0;i<nA;++i) {
            for (int j=0;j<1<<nB;++j) {
                chkmax(dp[i+1][j], dp[i][j]);
                chkmax(dp[i+1][j|ls[i]], dp[i][j]-A[i]);
            }
        }
        int mx = 0;
        for (int j=0;j<1<<nB;++j) {
            int cur = dp[nA][j];
            for (int i=0;i<nB;++i) if (j&(1<<i)) cur += B[i];
            chkmax(mx, cur);
        }
        ans += mx;
    }
    cout << fixed << ans / 2. << "\n";
}
```

---

>/ 当最后一缕余温消亡 /
>
>/ 空躯壳何处能够安放 /
>
>/ 睁眼醒于温暖的慌 /
>
>/ 一笑而过继续坚强 /
>
> —— [孤寂code - *逆光* ft. 洛天依](https://vocadb.net/S/167707)
>