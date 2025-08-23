---
date: 2022-02-21
title: 「loj - 6179」Pyh 的求和
category: notes
tags: [number-theory]
---

[link。](https://loj.ac/p/6179)

我们想要求出 $\varphi(ij)=\varphi(i)\varphi(j)C$ 中的常数。先研究 $i=p^a$，$j=p^b$ 的情况，即 $\varphi(p^{a+b})=\varphi(p^a)\varphi(p^b)C=p^{a+b}\frac{p-1}{p}=p^{a+b}\left(\frac{p-1}{p}\right)^2C\Longrightarrow C=\frac{p}{p-1}$。现在把情况推广到 $i,j\in\mathbb{N_\ast}$ 的情况，就，你想象一下，前面 $p^{a+b}$ 变成了一个普通合数，后面的 $\frac{p}{p-1}$ 变成了一坨连乘，可以肉眼看出结论 $\varphi(ij)=\varphi(i)\varphi(j)\frac{(i,j)}{\varphi((i,j))}$。

把这个带入原式，得到一个套路的的式子，这里直接给出最后的形式 $\displaystyle\sum_{T=1}^{\min(n,m)}\sum_{d\mid T}\frac{d}{\varphi(d)}\mu\left(\frac{T}{d}\right)\sum_{i=1}^{\lfloor\frac{n}{T}\rfloor}\varphi(i\times T)\sum_{j=1}^{\lfloor\frac{m}{T}\rfloor}\varphi(j\times T)$，令 $\displaystyle f(n,T)=\sum_{i=1}^{n}\varphi(i\times T)$，$\displaystyle g(T)=\sum_{d\mid T}\frac{d}{\varphi(d)}\mu(\frac{T}{d})$，如果这两个东西可以直接筛出来就做完了。

式子基本上不能推了，于是我们考虑暴力，直接设个阈值，一半暴力算，一半预处理。调调参就行了。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int P = 998244353, THRESHOLD = 25;
#define cmin(x, ...) x = min({x, __VA_ARGS__})
#define cmax(x, ...) x = max({x, __VA_ARGS__})
#define fors(i, l, r, ...) for(int i = (l), i##end = (r), ##__VA_ARGS__; i <= i##end; i++)
#define dfors(i, r, l, ...) for(int i = (r), i##end = (l), ##__VA_ARGS__; i >= i##end; i--)
const auto [f, g, s] = [](const int n, const int THRESHOLD) {
    vector<int> mu(n+1), phi(n), prime, g(n+1), invs(n+1);
    vector<bool> not_prime(n+1);
    vector f(n+1, vector<int>());
    vector s(THRESHOLD+1, vector(THRESHOLD+1, vector<int>()));
    mu[1] = phi[1] = 1;
    fors(i, 2, n) {
        if(not_prime[i] == 0) {
            prime.emplace_back(i);
            mu[i] = P-1, phi[i] = i-1;
        }
        for(const int p : prime) {
            if(i > n/p) break;
            not_prime[i*p] = 1;
            if(i%p == 0) {
                phi[i*p] = phi[i]*p;
                break;
            }
            phi[i*p] = phi[i]*(p-1), mu[i*p] = P-mu[i];
        }
    }
    invs[1] = 1;
    fors(i, 2, n) invs[i] = ll(P-P/i)*invs[P%i]%P;
    fors(d, 1, n) {
        for(int T = d; T <= n; T += d) g[T] += ll(d)*invs[phi[d]]%P*mu[T/d]%P,g[T] %= P;
    }
    fors(i, 1, n) {
        f[i].emplace_back(0);
        fors(T, 1, n/i) f[i].emplace_back((f[i][T-1]+phi[i*T])%P);
    }
    fors(i, 1, THRESHOLD) {
        fors(j, 1, THRESHOLD) {
            s[i][j].emplace_back(0);
            fors(k, 1, min(n/i, n/j)) s[i][j].emplace_back((s[i][j][k-1]+ll(g[k])*f[k][i]%P*f[k][j]%P)%P);
        }
    }
    return make_tuple(f, g, s);
}(1e5, THRESHOLD);
signed main() {
    ios::sync_with_stdio(0), cin.tie(0);
    int tt, n, m, ans;
    for(cin >> tt; ans = 0, tt--;) {
        cin >> n >> m;
        if(n > m) swap(n, m);
        fors(i, 1, m/THRESHOLD) ans += ll(g[i])*f[i][n/i]%P*f[i][m/i]%P,ans %= P;
        for(int l = m/THRESHOLD+1, r; l <= n; l = r+1) {
            r = min(n/(n/l), m/(m/l));
            ans += (s[n/l][m/l][r]-s[n/l][m/l][l-1]+P)%P, ans %= P;
        }
        cout << ans << "\n";
    }
    return 0;
}
```
    