---
date: '2020-08-07'
title: 'Solution -「CF 1043F」Make It One'

---

## 题意简述

给定一个整数集合，让你挑出一个子集，使得子集里的数互素，问最少挑多少个。

## 题解

又是一道很妙的题。

好像其他的题解都是一维 DP 或者直接纯数学方法，这里提供一种好理解一点的二维 DP。

开始拿到这道题，没有任何思路。

然后开始猜答案的范围，想着能不能直接枚举或者二分。

然后发现 $2\times3\times5\times7\times11\times13\times17>300000$，所以 300000 以内的数字最多有 6 个质因子。

所以我们的答案最多为 6 吗？不是的，因为如果令七个数分别等于这七个质数的其中六个（互不相同），一共七个，所以答案上限为七。

那么基本上答案的枚举可以当成常数了。

这里有一个大胆的 DP：我们定义 `dp[i][j]`: 表示选 $i$ 个数的情况下所有选择的 $i$ 个数的 **公约数** 为 $j$ 的方案数。

为什么这里要设为公约数而不是最大公约数呢？

因为这样才方便我们去重。

本来我想的是定义存在性，不过好像方程不好找，于是放弃了。

那么方程为（未去重）：$dp_{i,j}=C_{cnt_{j}}^{i}$。

其中 `cnt[x]` 表示集合中有多少数是 $x$ 的倍数。

因为我们 DP 的定义是公约数，所以我们需要去掉不是最大公约数的情况。

所以去重过后，我们的 DP 方程为：$dp_{i,j}=C_{cnt_{j}}^{i}-\sum_{j\mid k\wedge k>j}dp_{k}$。

最后的答案就是 $\min\{i\},dp_{i,1}>0$。

```cpp[class="line-numbers"]
#include <cstdio>

const int Maxn = 3e5 + 5, Maxv = Maxn - 5, Mod = 1e9 + 7;
int n, a[Maxn], cnt[Maxn], dp[10][Maxn], fac[Maxn], inv[Maxn];
// dp[i][j]: 表示选 i 个数的情况下公约数 为 j 的方案数

int add(int x, int y) { return ((x + y) % Mod + Mod) % Mod; }
int mul(int x, int y) { return (long long)x * y % Mod; }

void exgcd(int a, int b, int &x, int &y)
{
	if (b == 0)
	{
		x = 1;
		y = 0;
		return ;
	}
	exgcd(b, a % b, y, x);
	y -= a / b * x;
}

int Inv(const int a, const int m)
{
	int x, y;
	exgcd(a, m, x, y);
	return ((x % m) + m) % m;
}

int C(int n, int k)
{
	if (n < k)	return 0;
	return mul(fac[n], mul(inv[k], inv[n - k]));
} // 以上板子

signed main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
	{
		scanf("%d", &a[i]);
		cnt[a[i]]++;
		dp[1][a[i]]++;
		if (a[i] == 1)
		{
			puts("1");
			return 0;
		}
	}
	fac[0] = 1;
	for (int i = 1; i <= n; ++i)	fac[i] = mul(fac[i - 1], i);
	for (int i = 0; i <= n; ++i)	inv[i] = Inv(fac[i], Mod); // 预处理阶乘和逆元，组合数用
	for (int i = 1; i <= Maxv; ++i)
	{
		for (int j = (i << 1); j <= Maxv; j += i)	cnt[i] += cnt[j];
	} // 预处理 cnt
	for (int i = 2; i <= 7; ++i)
	{
		for (int j = Maxv; j >= 1; --j)
		{
			dp[i][j] = C(cnt[j], i);
			for (int k = (j << 1); k <= Maxv; k += j)	dp[i][j] = add(dp[i][j], -dp[i][k]);
		}
	}
	for (int i = 1; i <= 7; ++i)
	{
		if (dp[i][1])
		{
			printf("%d\n", i);
			return 0;
		}
	}
	puts("-1");
	return 0;
}
```