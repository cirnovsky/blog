---
date: 2020-09-23
title: Solution -「HDU 3507」Print Article
category: notes
tags: [data-structures,geometry,dp]
---

## Description

[Link](http://acm.hdu.edu.cn/showproblem.php?pid=3507).

给出 $N$ 个单词，每个单词有个非负权值 $C_{i}$，现要将它们分成连续的若干段，每段的代价为此段单词的权值和，还要加一个常数 $M$，即 $(\sum C_{i})^{2}+M$。现在想求出一种最优方案，使得总费用之和最小

## Solution

设 $f_{i}$ 表示 $n=i$ 时的答案，转移方程为：

$$
f_{i}=\min\{f_{j}+S_{i..j}^{2}+M\}
$$

显然过不了，推成可以斜率优化的形式。

我们假设决策 $j$ 优于决策 $k$ 且 $k<j<i$。

（一种错误的思路）

$$
f_{j}+S_{i..j}^{2}+M<f_{k}+S_{i..k}^{2}+M
$$

$$
f_{j}+(S_{i}-S_{j})^{2}<f_{k}+(S_{i}-S_{k})^2
$$

$$
f_{j}+S_{i}^2-2S_{i}S_{j}+S_{j}^{2}<f_{k}+S_{i}^2-2S_{i}S_{k}+S_{k}^{2}
$$

$$
f_{j}-2S_{i}S_{j}+S_{j}^{2}<f_{k}-2S_{i}S_{k}+S_{k}^{2}
$$

$$
f_{j}-2S_{i}S_{j}+2S_{i}S_{k}+S_{j}^{2}-S_{k}^{2}-f_{k}<0
$$

$$
f_{j}-2S_{i}(S_{j}+ S_{k})+(S_{j}-S_{k})(S_{j}+S_{k})-f_{k}<0
$$

$$
f_{j}-(S_{j}+ S_{k})(2S_{i}+S_{j}-S_{k})-f_{k}<0
$$

$$
f_{j}-\frac{S_{j}+ S_{k}}{2S_{i}+S_{j}-S_{k}}-f_{k}<0
$$

最后发现做 $\text{TM}$ 不出来。

于是重新推：

（另一种错误思路）（我简直自闭）

$$
f_{j}+S_{i..j}^{2}+M<f_{k}+S_{i..k}^{2}+M
$$

$$
f_{j}+(S_{i}-S_{j})^{2}<f_{k}+(S_{i}-S_{k})^2
$$

$$
f_{j}+S_{i}^2-2S_{i}S_{j}+S_{j}^{2}<f_{k}+S_{i}^2-2S_{i}S_{k}+S_{k}^{2}
$$

$$
f_{j}-2S_{i}S_{j}+S_{j}^{2}<f_{k}-2S_{i}S_{k}+S_{k}^{2}
$$

$$
f_{j}-f_{k}+S_{j}^{2}-S_{k}^{2}<2S_{i}S_{j}-2S_{i}S_{k}
$$

$$
f_{j}-f_{k}+S_{j}^{2}-S_{k}^{2}<2S_{i}(S_{j}-S_{k})
$$

$$
f_{j}-f_{k}+(S_{j}-S_{k})(S_{j}+S_{k})<2S_{i}(S_{j}-S_{k})
$$

$$
\frac{f_{j}-f_{k}}{2(S_{j}-S_{k})}+\frac{S_{j}+S_{k}}{2}<S_{i}
$$

嗯，还是 $\text{TM}$ 做不来。

好了，推倒重来。

（这次是对的）

$$
f_{i}=\min\{f_{j}+S_{i..j}^{2}+M\}
$$

$$
f_{j}+S_{i..j}^{2}+M<f_{k}+S_{i..k}^{2}+M
$$

$$
f_{j}+(S_{i}-S_{j})^{2}<f_{k}+(S_{i}-S_{k})^2
$$

$$
f_{j}+S_{i}^2-2S_{i}S_{j}+S_{j}^{2}<f_{k}+S_{i}^2-2S_{i}S_{k}+S_{k}^{2}
$$

$$
f_{j}-2S_{i}S_{j}+S_{j}^{2}<f_{k}-2S_{i}S_{k}+S_{k}^{2}
$$

$$
f_{j}-f_{k}+S_{j}^{2}-S_{k}^{2}<2S_{i}S_{j}-2S_{i}S_{k}
$$

$$
f_{j}-f_{k}+S_{j}^{2}-S_{k}^{2}<2S_{i}(S_{j}-S_{k})
$$

$$
\frac{(f_{j}+S_{j}^{2})-(f_{k}+S_{k}^{2})}{2(S_{j}-S_{k})}<S_{i}
$$

我们令 $Y_{i}=f_{i}+S_{i}^{2}$，$X_{i}=2S_{i}$，则我们有：

$$
\frac{Y_{j}-Y_{k}}{X_{j}-X_{k}}<S_{i}
$$

挺好的，正好就是斜率优化的形式！

斜率优化！

牛逼啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎哎啊啊哎。

那么接下来我们设 $F(j,k)=\frac{Y_{j}-Y_{k}}{X_{j}-X_{k}}$。

其中如果满足 $F(j,k)<S_{i}$，则我们称决策 $j$ 优于决策 $k$。

现在我们继续设 $k<j<i$，那么如果满足 $F(i,j)<F(j,k)$，决策 $j$ 就永远不可能成为最优解。

证明不会，$\text{PPT}$ 没看懂。

最后放个 $\text{PPT}$ 里写的 $\text{Summary}$：

1、用一个单调队列来维护解集。

2、假设队列中从头到尾已经有元素 $a$，$b$，$c$。那么当 $d$ 要入队的时候，维护队列的上凸性质，即如果 $F(d,c)<F(c,b)$，那么删除点 $c$。直到找到 $F(d,x)\ge F(x,y)$ 为止，并将 $d$ 点加入在该位置中。

3、求解的时候，从对头开始，如果已有元素 $a$，$b$，$c$，当 $i$ 点要求解时，如果 $F(b,a)<S_{i}$，说明 $b$ 点比 $a$ 点更优，$a$ 点直接排除，于是 $a$ 出队，最后 $f_{i} = \mathrm{getDp}(Q[\mathrm{head}])$。

```cpp
#include <cstdio>
#include <cstdlib>
using namespace std;
typedef long long LL;

namespace MySpace
{
	template<class _T>
	void read(_T &x)
	{
		x = 0;
		char c = getchar();
		_T f = 1;
		while( c < '0' || c > '9' )
		{
			if( c == '-' )	f = -1;
			if( c == -1 )	exit( 0 );
			c = getchar();
		}
		while( c >= '0' && c <= '9' )	x = x * 10 + c - '0', c = getchar();
		x *= f;
	}
	
	template<class _T>
	void write(_T x)
	{
		if( x < 0 )	putchar( '-' ), x = -x;
		if( x > 9 )	write( x / 10 );
		putchar( x % 10 + '0' );
	}
	
	const LL MAXN = 5e5 + 5;
	LL N, M, Dp[MAXN], Q[MAXN], S[MAXN], A[MAXN];
	
	LL Square( LL x ) { return x * x; }
	LL Up( LL i ) { return Dp[i] + Square( S[i] ); }
	LL Down( LL i ) { return S[i] << 1; }
	LL FracUp( LL j, LL k ) { return Up( j ) - Up( k ); }
	LL FracDown( LL j, LL k ) { return Down( j ) - Down( k ); }
}

int main()
{
	using namespace MySpace;
	while( ~ scanf( "%lld%lld", &N, &M ) )
	{
		for( LL i = 1; i <= N; ++ i )	scanf( "%lld", &A[i] ), S[i] = S[i - 1] + A[i];
		LL l = 1, r = 1;
		Q[r] = 0;
		for( LL i = 1; i <= N; ++ i )
		{
			while( l < r && FracUp( Q[l + 1], Q[l] ) < S[i] * FracDown( Q[l + 1], Q[l] ) )	l ++;
			Dp[i] = Dp[Q[l]] + Square( S[i] - S[Q[l]] ) + M;
			while( l < r && FracUp( i, Q[r] ) * FracDown( Q[r], Q[r - 1] ) <= FracUp( Q[r], Q[r - 1] ) * FracDown( i, Q[r] ))	r --;
			Q[++ r] = i;
		}
		printf( "%lld\n", Dp[N] );
	}
//	while( read( N ), read( M ), 1 )
//	{
//		for( LL i = 1; i <= N; ++ i )	read( A[i] ), S[i] = S[i - 1] + A[i];
//		LL l = 1, r = 0;
//		Q[l] = 0;
//		for( LL i = 1; i <= N; ++ i )
//		{
//			while( l <= r && FracUp( Q[l + 1], Q[l] ) < S[i] * FracDown( Q[l + 1], Q[l] ) )	l ++;
//			Dp[i] = Dp[Q[l]] + Square( S[i] - S[Q[l]] ) + M;
//			while( l <= r && FracUp( i, Q[r - 1] ) * FracDown( Q[r - 1], Q[r - 2] ) < FracUp( Q[r - 1], Q[r - 2] ) * FracDown( i, Q[r - 1] ))	r ++;
//			Q[++ r] = i;
//		}
//		write( Dp[N] ), putchar( '\n' );
//	}
	return 0;
}
```
    