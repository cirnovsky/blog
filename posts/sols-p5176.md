---
date: 2021-05-30
title: Solution -「洛谷 P5176」公约数
category: notes
tags: [maths,number-theory]
---

## Description

[Link](https://www.luogu.com.cn/problem/P5176).

求

$$\sum_{i=1}^n\sum_{j=1}^m\sum_{k=1}^p\gcd(i\cdot j,i\cdot k,j\cdot k)\times \gcd(i,j,k)\times \left(\frac{\gcd(i,j)}{\gcd(i,k)\times \gcd(j,k)}+\frac{\gcd(i,k)}{\gcd(i,j)\times \gcd(j,k)}+\frac{\gcd(j,k)}{\gcd(i,j)\times \gcd(i,k)}\right)$$

## Solution

考虑把 $i,j,k$ 分别唯一分解，显然 $ij,jk,ik$ 并没有增加唯一分解后使用的质数数量，仅仅改变了指数。再考虑 $\gcd$ 的本质就是唯一分解后对指数取 $\min$ 的乘积结果。钦定研究一个质因数，设 $i,j,k$ 该质因数的指数分别为 $a,b,c$，则 $\gcd$ 上该位的指数为 $\min(a,b,c)$，我们做这样一个容斥：$\min(a+b,b+c,a+c)=\min(a,b)+\min(a,c)+\min(b,c)-\min(a,b,c)$。证明不妨设 $a<b<c$ 即证。

那么有：

$$
\sum_{i=1}^{n}\sum_{j=1}^{m}\sum_{k=1}^{p}(ij,ik,jk)(i,j,k)\left(\frac{(i,j)}{(i,k)(j,k)}+\frac{(i,k)}{(i,j)(j,k)}+\frac{(j,k)}{(i,j)(i,k)}\right) \\
\begin{aligned}
&=\sum_{i=1}^{n}\sum_{j=1}^{m}\sum_{k=1}^{p}\frac{(i,j)(i,k)(j,k)}{(i,j,k)}(i,j,k)\frac{(i,j)^{2}+(i,k)^{2}+(j,k)^{2}}{(i,j)(i,k)(j,k)} \\
&=\sum_{i=1}^{n}\sum_{j=1}^{m}\sum_{k=1}^{p}(i,j)^{2}+(i,k)^{2}+(j,k)^{2} \\
\end{aligned}
$$

注意到三个部分并无本质不同，我们设 $F(n,m,p)=p\sum_{i=1}^{n}\sum_{j=1}^{m}(i,j)^{2}$，答案即 $F(n,m,p)+F(n,p,m)+F(m,p,n)$。接下来推导 $F$，同时钦定 $n<m$：

$$
\sum_{i=1}^{n}\sum_{j=1}^{m}(i,j)^{2} \\
\begin{aligned}
&=\sum_{d=1}^{n}\sum_{i=1}^{\lfloor\frac{n}{d}\rfloor}\sum_{j=1}^{\lfloor\frac{m}{d}\rfloor}d^{2}[(i,j)=1] \\
&=\sum_{d=1}^{n}d^{2}\lfloor\frac{n}{d}\rfloor\lfloor\frac{m}{d}\rfloor\sum_{t\mid(i,j)}\mu(t) \\
&=\sum_{T=1}^{n}\sum_{d\mid T}d^{2}\lfloor\frac{n}{d}\rfloor\lfloor\frac{m}{d}\rfloor\mu(\frac{T}{d}) \\
\end{aligned}
$$
令 $f(x)=\sum_{d|x}d^{2}\mu(\frac{x}{d})$，显然是个积性函数，$f(p)=p^{2}-1$，不需要 $k$ 次方就能做了欸。

```cpp
#include<bits/stdc++.h>
#define con(typ) const typ
typedef long long ll;
template<typename T>void sf(T &x){x=0;T f=0;char c=getchar();for(;c<'0'||c>'9';c=getchar())if(c=='-')f=1;for(;c>='0'&&c<='9';c=getchar())x=(x<<3)+(x<<1)+(c^'0');if(f)x=-x;}
template<typename T>void pf(T x,char l='\n'){static int s[100],t;if(x<0)putchar('-'),x=-x;do s[++t]=x%10,x/=10;while(x);while(t)putchar(s[t--]^'0');putchar(l);}
con(int) MOD=1e9+7;
int T,n,m,p;
ll mu[20000010],f[20000010],tag[20000010],prime[20000010],cnt;
void makePrime(int l)
{
	mu[1]=f[1]=1;
	for(ll i=2;i<=l;++i)
	{
		if(!tag[i])	prime[++cnt]=i,f[i]=(i*i%MOD-1+MOD)%MOD;
		for(int j=1;j<=cnt && prime[j]*i<=l;++j)
		{
			tag[i*prime[j]]=1;
			if(i%prime[j])	f[i*prime[j]]=f[i]*f[prime[j]]%MOD;
			else
			{
				f[i*prime[j]]=f[i]*prime[j]%MOD*prime[j]%MOD;
				break;
			}
		}
	}
	for(int i=1;i<=l;++i)	f[i]+=f[i-1],f[i]%=MOD;
}
ll cal(int n,int m,int p)
{
	if(n>m)	n^=m^=n^=m;
	ll res=0;
	for(int l=1,r;l<=n;l=r+1)
	{
		r=std::min(n/(n/l),m/(m/l));
		res+=(f[r]-f[l-1]+MOD)*(n/l)%MOD*(m/l)%MOD;
		res%=MOD;
	}
	return (res*p%MOD+MOD)%MOD;
}
int main()
{
	makePrime(2e7);
	for(sf(T);T;--T)	sf(n),sf(m),sf(p),pf(((cal(n,m,p)+cal(n,p,m)%MOD)+cal(m,p,n))%MOD);
	return 0;
}
```
    