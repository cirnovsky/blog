---
date: 2021-03-12
title: Solution -「香港网络赛 2016」A+B Problem
category: notes
tags: [maths,polynomials]
---

## Description

[Link](http://222.180.160.110:1024/problem/28863).

给出一个长度为 $n$ 的序列 $a$，问有序三元组 $(a_{i},a_{j},a_{k})$ 使得 $i\neq j\neq k$ 且 $a_{i}+a_{j}=a_{k}$ 的数量。

## Solution

发现这个值域有说头，于是设 $F(x)=\sum_{i=1}^{n}x^{a_{i}}$。

然后求出 $F^{2}(x)$，判断一通就好了。

主要是记录一下这种多项式题的常用 trick，把值域小的整成多项式或者生成函数一类的。

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long LL;
namespace Poly
{
	typedef complex<double> comp;
	typedef vector<complex<double> > poly;
	#define len(x) (LL((x).size()))
	const double bh_pi=acos(-1);
	LL lim,rev[400010];
	void fft(poly &f,LL op)
	{
		for(LL i=0;i<lim;++i)	if(i<rev[i])	swap(f[i],f[rev[i]]);
		for(LL len=2;len<=lim;len<<=1)
		{
			comp bas(cos(2*bh_pi/len),op*sin(2*bh_pi/len));
			for(LL fr=0;fr<lim;fr+=len)
			{
				comp now(1,0);
				for(LL ba=fr;ba<fr+(len>>1);++ba,now*=bas)
				{
					comp tmp=now*f[ba+(len>>1)];
					f[ba+(len>>1)]=f[ba]-tmp;
					f[ba]+=tmp;
				}
			}
		}
		if(op==-1)	for(LL i=0;i<lim;++i)	f[i]/=lim;
	}
	poly mulself(poly f)
	{
		LL n=(len(f)<<1)-1; lim=1;
		while(lim<n)	lim<<=1;
		for(LL i=0;i<lim;++i)	rev[i]=(rev[i>>1]>>1)|((i&1)?(lim>>1):0);
		f.resize(lim),fft(f,1);
		for(LL i=0;i<lim;++i)	f[i]*=f[i];
		fft(f,-1),f.resize(n);
		return f;
	}
}using namespace Poly;
LL n,mx,nzr,tmp[400010],a[400010],ans;
const LL lay=50000;
int main()
{
	scanf("%lld",&n);
	poly f(100001);
	for(LL i=1,x;i<=n;++i)
	{
		scanf("%lld",&x);
		mx=max(mx,lay+x);
		f[lay+x]=comp(f[lay+x].real()+1,0);
		nzr+=(x==0),a[i]=x;
	}
	++mx;
	f.resize(mx);
	f=mulself(f);
	for(LL i=0;i<len(f);++i)	tmp[i]=LL(f[i].real()+0.49);
	for(LL i=1;i<=n;++i)	--tmp[(lay+a[i])<<1];
	for(LL i=1;i<=n;++i)
	{
		ans+=tmp[a[i]+(lay<<1)];
		if(a[i])	ans-=(nzr<<1);
		else	ans-=((nzr-1)<<1);
	}
	printf("%lld\n",ans);
	return 0;
}
```
    