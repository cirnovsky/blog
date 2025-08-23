---
date: 2022-08-06
title: 「codeforces - 585E」Present for Vitalik the Philatelist
category: notes
tags: [dp,number-theory]
---

[link。](http://codeforces.com/problemset/problem/585/E)

设 $\displaystyle f(x) = \# S', s.t. S' \subseteq S, S' \neq \varnothing, \gcd(S') = x$，$g(x) = \# t, s.t. \gcd(t, x) = 1$，则答案为 $\sum f_i \times g_i$。

- $f$：这个的求解是老套路了，设 $\displaystyle F(x) = \# S', s.t. S' \subseteq S, S' \neq \varnothing, x \mid S'$，则有 $\displaystyle F(x) = 2^{\sum_{x \mid t} \textit{cnt}_t}-1$，$cnt$ 是桶，$\displaystyle f(x) = \sum_{x \mid d} \mu(\frac{d}{x}) \times F(d)$，可以调和级数~~也可以逆 dirichlet 前后缀和~~（不可以）。
- $g$：写出 $\displaystyle g_T = \sum_i [(T, i) = 1] \textit{cnt}_i = \sum_{d \mid T} \mu(d) \sum_{d \mid i} cnt_i = \sum_{d \mid T} h_d$，其中 $h_d = \mu(d) \times w_d$，其中 $\displaystyle w_T = \sum_{T \mid i} \textit{cnt}_i$。都是 dirichlet 前后缀和的形式。

```cpp
using modint = modint1000000007;
bitset<10000100> tag;
int n, up, tot, prm[10000100], mu[10000100], w[10000100];
modint f[10000100], F[10000100], pw[10000100];
void sieve(int maxn) {
    mu[1] = 1;
    for (int i=2; i<=maxn; ++i) {
        if (!tag[i]) {
            prm[++tot] = i;
            mu[i] = -1;
        }
        for (int j=1; j<=tot && i<=maxn/prm[j]; ++j) {
            tag.set(i*prm[j]);
            if (i%prm[j] == 0) {
                break;
            }
            mu[i*prm[j]] = -mu[i];
        }
    }
}
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    cin >> n;
    for (int i=1,x; i<=n; ++i) {
        cin >> x, w[x]++;
        cmax(up, x);
    }
    sieve(up);
    pw[0] = 1;
    for (int i=1; i<=up; ++i) {
        pw[i] = pw[i-1]*2;
    }
    for (int i=1; i<=tot; ++i) {
        for (int j=up/prm[i]; j>=1; --j) {
            w[j] += w[j*prm[i]];
        }
    }
    for (int i=1; i<=up; ++i) {
        F[i] = pw[w[i]]-1;
    }
    for (int i=1; i<=up; ++i) {
        for (int d=i; d<=up; d+=i) {
            f[i] += mu[d/i]*F[d];
        }
    }
#define g F
    for (int i=1; i<=up; ++i) {
        g[i] = mu[i]*w[i];
    }
    for (int i=1; i<=tot; ++i) {
        for (int j=1; j<=up/prm[i]; ++j) {
            g[j*prm[i]] += g[j];
        }
    }
    modint ans = 0;
    for (int i=2; i<=up; ++i) {
        ans += f[i]*g[i];
    }
    cout << ans.val() << "\n";
}
```
    