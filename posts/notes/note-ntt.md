---
date: '2020-03-26'
title: 'Note -「Number Theory Transform」'

---

# 0x00 前言

学了FFT就想学NTT（捂脸 

# 0x01 原根

## 阶

设两数 $r,n\in \mathbb{Z},r\neq 0,n>0,(r,n)=1$

使得 $r^{x}\equiv 1(\operatorname{mod} n)$ 成立的最小正整数 $x$ 即为 $r$ 模 $n$ 的阶。

记作 $\operatorname{ord}_{n}r$

比如说我们要计算 $\operatorname{ord}_{n}r$

那么

$$3^{1}=3(\operatorname{mod}10)$$

$$3^{2}=1(\operatorname{mod}10)$$

所以 $\operatorname{ord}_{n}r=2$

## 原根

原根的定义是当 $(r,n)=1$ 时，$\operatorname{ord}_{n}r=\varphi(n)$，则称 $r$ 是模 $n$ 的原根。

其中 $\varphi$ 是数论的欧拉函数。

其实原根还有一种定义。

对于 $g,p\in \mathbb{Z}$，如果 $\forall i,j(1\leq i<j\leq p-1),g^{i}\operatorname{mod}p\neq g^{j}\operatorname{mod}p$ 则称 $g$ 是模 $p$ 的原根。

~~其实差qiu不多~~

好了原根没了（（

NTT的模数通常来说只能是988244353。

~~为什么不能是某长者生日~~

~~顺带一提LF的OJ登录邮箱lifan后面的一串数字是个质数~~

# 0x02 从FFT到NTT

其实NTT就是把FFT的单位根换成了原根。

你想啊，FFT每次计算都要用三角函数，常数++。

然后复数运算，常数++，精度--然后不能取模。

所以原根就好多了对吧。

整数运算，精度不变，常数较小然后可以取模。

不用三角函数，常数较小。

但是取模一般只能取998244353，此时的原根为3。别问，问就是暴算。

具体来说，比如当区间中点为 $mid$，长度为 $len=mid\times 2$ 时，我们的单位根是 $\cos\frac{\pi}{mid}+i\sin\frac{\pi}{mid}$。此时原根就是 $g^{\frac{p-1}{2\times mid}}$。

那么问题来了，我们为什么能用原根代替单位根呢？

答案是因为证明DFT和IDFT过程中用到的单位根性质原根同样满足。大家可以自己去证一下，还是比较easy的。

~~又是人丑自带大常数系列~~

~~这次甚至开O2都稳如泰山~~

```cpp[class="line-numbers"]
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>

using namespace std;

const int MAXN = 5000000 + 5;
const int MOD = 998244353;
int n, m, a[MAXN], b[MAXN], rev[MAXN];

int fast_pow(int x, int y) {
	long long res = 1;
	long long base = (long long)x;
	for (; y; y >>= 1, base = (base * base) % MOD)
		res = ((!(y & 1)) * res) + ((y & 1) * (res * base) % MOD);
	return (int)res % MOD;
}

void get_rev() {
	int lim = 0;
	while ((1 << lim) < n) lim++;
	for (int i = 0; i < n; ++i) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (lim - 1));
}

void ntt(int *f, int inv) {
	get_rev();
	for (int i = 0; i < n; ++i) if (i < rev[i]) swap(f[i], f[rev[i]]);
	for (int mid = 1; mid < n; mid <<= 1) {
		int baseform, t = fast_pow(3, (MOD - 1) / (mid << 1));
		if (~inv) baseform = t;
		else baseform = fast_pow(t, MOD - 2);
		for (int i = 0; i < n; i += (mid << 1)) {
			int omega = 1;
			for (int j = 0; j < mid; ++j) {
				int first = f[i + j];
				int second = 1ll * omega * f[i + j + mid] % MOD;
				f[i + j] = ((first + second) % MOD + MOD) % MOD;
				f[i + j + mid] = ((first - second) % MOD + MOD) % MOD;
				omega = 1ll * omega * baseform % MOD;
			}
		}
	}
}

signed main() {
	scanf("%d %d", &n, &m);
	for (int i = 0; i <= n; ++i) scanf("%d", &a[i]);
	for (int i = 0; i <= m; ++i) scanf("%d", &b[i]);
	for (m += n, n = 1; n <= m; n <<= 1) ;
	ntt(a, 1);
	ntt(b, 1);
	for (int i = 0; i < n; ++i) a[i] = (1ll * a[i] * b[i]) % MOD;
	ntt(a, -1);
	for (int i = 0; i <= m; ++i) printf("%lld ", 1ll * a[i] * fast_pow(n, MOD - 2) % MOD);
	return 0;
}
```