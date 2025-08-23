---
date: 2020-11-25
title: Solution -「洛谷 P3773」「CTSC 2017」吉夫特
category: notes
tags: [dp,bitwise,combinatorics]
---

## Description

[Link](https://www.luogu.com.cn/problem/P3773).

求满足

$$\prod _{i=2}^{k} \binom{a_{b_{i-1}}}{a_{b_i}} \mod 2 = \binom{a_{b_1}}{a_{b_2}} \times \binom{a_{b_2}}{a_{b_3}} \times \cdots \binom{a_{b_{k-1}}}{a_{b_k}} \mod 2 > 0$$

的子序列个数。

## Solution

哇哦。

$$
\begin{aligned}
&\ \ \ \ \prod_{i=2}^{k}{a_{b_{i}-1}\choose a_{b_{i}}} \\
&\equiv\prod_{i=2}^{k}{\lfloor\frac{a_{b_{i}-1}}{2}\rfloor\choose\lfloor\frac{a_{b_{i}}}{2}\rfloor}\times{a_{b_{i}-1}\bmod2\choose a_{b_{i}}\bmod2}
\end{aligned}
(\operatorname{mod} 2)
$$

式子后面的 $\dbinom{a_{b_{i}-1}\bmod2}{a_{b_{i}\bmod2}}$ 一共有四种情况，其中只有 $\dbinom{0}{1}=0$。其他都为 $1$。

意味着只要出现 $a_{b_{i}-1}\equiv0\bmod2$ 且 $a_{b_{i}}\equiv1\bmod1$ 的情况，整个式子就为零了。

结论：$\dbinom{n}{m}\equiv0\space(\operatorname{mod}2)$ 当且仅当 $n\operatorname{bitand}m=m$。

证明（也许不是特别严谨）：我们可以知道：
$$
{n\choose m}={\lfloor\frac{n}{2}\rfloor\choose\lfloor\frac{m}{2}\rfloor}\times{n\bmod 2\choose m\bmod2}={\lfloor\frac{\lfloor\frac{n}{2}\rfloor}{2}\rfloor\choose\lfloor\frac{\lfloor\frac{m}{2}\rfloor}{2}\rfloor}\times {\lfloor\frac{n}{2}\rfloor\bmod2\choose\lfloor\frac{m}{2}\rfloor\bmod2}\times{n\bmod 2\choose m\bmod2}=\cdots
$$
我们发现：
$$
{\lfloor\frac{\lfloor\frac{\lfloor\frac{n}{2}\rfloor}{2}\rfloor}{\cdots}\rfloor\choose\lfloor\frac{\lfloor\frac{\lfloor\frac{m}{2}\rfloor}{2}\rfloor}{\cdots}\rfloor}
$$
这一坨，就是在一直进行二进制移位，$\operatorname{shr}1$。

那么我们可以得出一个结论：如果对于我们记 $(n)_{k}$ 表示 $n$ 在二进制意义下的第 $k$ 位。$(n)_{k}\in[0,1]$

那么对于 $\forall i$，有 $(n)_{i}=0$ 且 $(m)_{i}=1$，那么 $\dbinom{n}{m}\equiv0\space(\operatorname{mod} 2)$。

所以 $n\operatorname{bitand}m=m$，证毕。

我们题目要求的是最后算出来是个奇数，那么就不能存在 $a_{b_{i}-1}\operatorname{bitand}a_{b_{i}}=a_{b_{i}}$。

也就是 $a_{b_{i}}$ 为 $a_{b_{i}-1}$ 的子集。

接下来我们可以设计一个 DP，我们设 $f_{i}$ 为以 $a_{i}$ 为开头的答案。

那么转移就是加法原理：
$$
f_{i}=f_{i}+f_{j},j\in a_{i}\wedge t_{j}>i
$$
其中 $t_{i}$ 表示 $i$ 在序列中的位置。

时间复杂度由二项式定理可知是 $\Theta(3^{\log_{2}\max\{a_{i}\}})$。

```cpp
#include <cstdio>
#define mod ( 1000000007 )

const int MAXN = 250000 + 5;

int N;
int val[MAXN], dp[MAXN];
int buc[MAXN];

int main( ){
	scanf( "%d", &N ); for( int i = 1; i <= N; ++ i ){ scanf( "%d", &val[i] ); buc[val[i]] = i; }
	int Ans = 0;
	for( int i = N; i; -- i ){
		dp[i] = 1;
		for( int j = val[i] & ( val[i] - 1 ); j; j = ( j - 1 ) & val[i] ){
			if( buc[j] > i )	dp[i] = ( dp[i] + dp[buc[j]] ) % mod;
		}
		Ans = ( Ans + dp[i] ) % mod;
	}
	printf( "%d\n", ( Ans - N + mod ) % mod );
	return 0;
}
```
    