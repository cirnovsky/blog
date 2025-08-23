---
date: 2020-11-25
title: Solution -「SP 106」BINSTIRL
category: notes
tags: [dp,bitwise,combinatorics]
---

## Description

[Link](https://www.luogu.com.cn/problem/SP106).

求 $\begin{Bmatrix}n \\ m\end{Bmatrix}\bmod2$

## Solution

求
$$
\begin{aligned}
\begin{Bmatrix}n \\ m\end{Bmatrix}\bmod2
&=\left(\begin{Bmatrix}n-1 \\ m-1\end{Bmatrix}+m\begin{Bmatrix}n-1 \\ m\end{Bmatrix}\right)\bmod2 \\
&=\begin{cases}
\begin{Bmatrix}n-1 \\ m-1\end{Bmatrix}\bmod2,m\equiv0\space(\operatorname{mod}2) \\
\left(\begin{Bmatrix}n-1 \\ m-1\end{Bmatrix}+\begin{Bmatrix}n-1 \\ m\end{Bmatrix}\right)\bmod2,m\equiv1\space(\operatorname{mod}2)
\end{cases}
\end{aligned}
$$
$m\equiv1\space(\operatorname{mod}2)$ 的情况为组合数的递推。

转化一下，把填表转移换成刷表，即

- 当 $m\equiv0\space(\operatorname{mod}2)$ 时，$\begin{Bmatrix}n \\ m\end{Bmatrix}$ 转移到 $\begin{Bmatrix}n+1 \\ m+1\end{Bmatrix}$。

- 当 $m\equiv1\space(\operatorname{mod}2)$ 时，$\begin{Bmatrix}n \\ m\end{Bmatrix}$ 转移到 $\begin{Bmatrix}n+1 \\ m+1\end{Bmatrix}$ 和 $\begin{Bmatrix}n+1 \\ m\end{Bmatrix}$。

那么这个题目就转化成了在表格上 $(0,0)$ 走到 $(n,m)$ 的路径条数 $\operatorname{mod}2$ 问题。

两种情况都可以转移到 $\begin{Bmatrix}n+1 \\ m+1\end{Bmatrix}$，为了方便起见，我们定义这种情况为向右上转移，把 $\begin{Bmatrix}n+1 \\ m\end{Bmatrix}$ 定义为向上转移。

因为我们转移只能向上或右上走，所以只会走 $n$ 步，其中 $m$ 次向右上转移，$n-m$ 次向右转移。

我们一共有 $\lfloor\frac{m+1}{2}\rfloor$ 次机会向右转移（只能从奇数走）。

相当于我们现在需要把转移的过程分成 $n-m$ 段，每一段的内部全部都是向右上转移，这样我们才能到达 $(n,m)$。

用盒子与球的语言来描述，就是一共就有 $n-m+\lfloor\frac{m+1}{2}\rfloor$ 个球（这里理解起来其实特别麻烦）（不过只是对于我这种组合差的人），分成 $\lfloor\frac{m+1}{2}\rfloor$ 段，隔板即可。

于是 $\begin{Bmatrix}n \\ m\end{Bmatrix}\bmod2={n-m+\lfloor\frac{m+1}{2}\rfloor-1\choose\lfloor\frac{m+1}{2}\rfloor-1}\bmod2$。

关于组合数奇偶性，[我这篇博客里写过](https://www.luogu.com.cn/blog/161849/solution-p3773)，再贴上来：

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

答案显然。

```cpp
#include <cstdio>

int N, M;

int main () {
	int TC; scanf ( "%d", &TC ); while ( TC -- > 0 ) {
		scanf ( "%d%d", &N, &M );
		if ( ! N && ! M )	puts ( "1" );
		else if ( ! N || ! M || N < M )	puts ( "0" );
		else if ( ( ( N - M + ( ( M + 1 ) >> 1 ) - 1 ) & ( ( ( M + 1 ) >> 1 ) - 1 ) ) == ( ( ( M + 1 ) >> 1 ) - 1 ) )	puts ( "1" );
		else	puts ( "0" );
	}
	return 0;
}
```
    