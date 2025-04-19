---
date: '2025-04-06'
title: 'Solution -「CF 1864H」Asterism Stream'
---

没想到吧，还有题解更新。

[Problem statement.](https://codeforces.com/problemset/problem/1864/H)

首先朴素的做法即令 $f(x)$ 为从 $x$ 出发到达任一 $\geqslant n$ 的数的期望步数，转移显然是 $f(x) = \frac 12(f(x+1) + f(2x))+1$。

令 $k=\frac 12$，几何级数 $a\times k^{bx}=\{a,b\}$。根据官方题解的说法，对于 $x\in[l,r]$，可以假设 $f(x) = \sum\{a,b\}$。这样假设是合理的，因为根据归纳法，若区间 $[2l, 2r]$ 可以以同样的形式表示，那么 $[l,r]$ 也可以，且 $f(x\in[n, 2n])=\{0, 0\}$。这样做的好处是，从 $[n, 2n]$ 推到 $[1, 1]$，需要维护的 $\{a,b\}$ 数量线性增长，又因为是折半递推，总的级数会很少。

然后再经过大力化式子，能得到
$$
f(x) = \{k^{r+1}f(r+1)-k^r+\sum\frac{ak^{(2b+1)(r+1)+1}}{k^{2b+1}-1},-1 \}+\{2,0\}+\sum\{\frac{-ak}{k^{2b+1}-1},2b \}
$$
这部分官解最后的结果写错了（$(2b+1)(r+1)\rightarrow (2b+1)(n+1)$）， 惩罚每一个不老实推式子的人。

需要注意的细节是折半递推区间的选择方式。

[完整代码可见此处。](https://codeforces.com/problemset/submission/1864/314185587)

```cpp
using mint = atcoder::modint998244353;
int main() {
	std::cin.tie(nullptr)->sync_with_stdio(0);
	int T; cin >> T;
	const mint k = mint(2).inv();
	while (T--) {
		ll n; rd(n);
		vector<mint> P, Q;
		mint zero = 0;
		if (n == 1) {
			cout << "0\n";
			continue;
		}
		for (ll l = (n + 1) / 2, r = max(1ll, n - 1);; l = (l + 1) / 2, r /= 2) {
			mint tmp = zero, tmp2 = 0;
			for (int i = 0, upp = Q.size(); i < upp; ++i) {
				tmp += Q[i] * k.inv().pow(1ll << i).pow(r + 1);
				tmp2 += Q[i] * k.inv().pow((1ll << (i + 1)) - 1).pow(r + 1) * k / (k.inv().pow((1ll << (i + 1)) - 1) - 1);
			}
			P.push_back(k.pow(r + 1) * tmp - k.pow(r) + tmp2 + zero * k.pow(r + 2) / (k - 1));
			for (int i = 0, upp = Q.size(); i < upp; ++i)
				P.push_back(-Q[i] * k / (k.inv().pow((1ll << (i + 1)) - 1) - 1));
			zero = 2 - zero * k / (k - 1);
			Q = P;
			vector<mint>().swap(P);
			if (l == 1)
				break;
		}
		for (int i = 0, upp = Q.size(); i < upp; ++i)
			zero += Q[i] * k.inv().pow(1ll << i);
		cout << zero.val() << "\n";
	}
	return 0;
}
```

