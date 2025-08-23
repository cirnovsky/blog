---
date: 2021-05-09
title: Solution -「THUPC 2021」区间矩阵乘法
category: notes
tags: [brute-force]
---

## Description

[Link](https://www.luogu.com.cn/problem/P7140).

给定长度为 $n$ 的序列 $a_1, a_2, \dots, a_n$；共 $m$ 组询问，每次询问给出 $d,p_1,p_2$，求

$$ \sum_{i=0}^{d-1} \sum_{j=0}^{d-1} \sum_{k=0}^{d-1} a_{p_1+d\cdot i+j} a_{p_2 + d\cdot j + k} $$

## Solution

$$
\sum_{i=0}^{d-1}\sum_{j=0}^{d-1}\sum_{k=0}^{d-1}a(p+di+j)a(q+dj+k) \\
\begin{aligned}
&=\sum_{i=0}^{d-1}\sum_{j=0}^{d-1}a(p+di+j)\sum_{k=0}^{d-1}a(q+dj+k) \\
&=\sum_{j=0}^{d-1}\left(\sum_{i=0}^{d-1}a(p+di+j)\right)\left(\sum_{k=0}^{d-1}a(q+dj+k)\right) \\
&=\sum_{j=0}^{d-1}\left(\sum_{i=0}^{d-1}a(p+di+j)\right)\left(pre(q+dj+d-1)-pre(q+dj-1)\right) \\
\end{aligned}
$$

由题意，$q+dj+k\le n$，也就是说 $q+d(d-1)+d(-1)=q+d^{2}\le n$，$q_{\min}=1$，所以 $d$ 是根号规模。

那么就可以直接来了，设 $s(i,j)$ 为前缀 $i$ 的间隔 $j$ 前缀和。比如 <font color="red">$\texttt{1 2 3 4 5 6}$</font> 的 $s(6,2)=12$，也就是 <font color="red">$\texttt{1}$</font><font color="blue">$\texttt{ 2}$</font><font color="red">$\texttt{ 3}$</font><font color="blue">$\texttt{ 4}$</font><font color="red">$\texttt{ 5}$</font><font color="blue">$\texttt{ 6}$</font>，蓝色表示被计入贡献，这个东西显然可以递推。

然后把这个带进式子
$$
\sum_{j=0}^{d-1}\left(\sum_{i=0}^{d-1}a(p+di+j)\right)\left(pre(q+dj+d-1)-pre(q+dj-1)\right) \\
\begin{aligned}
&=\sum_{j=0}^{d-1}\left(s(p+j+d(d-1),d)-s(p+j,d)+a(p+j)\right)\left(pre(q+dj+d-1)-pre(q+dj-1)\right) \\
\end{aligned}
$$
然后就可以直接算了。

然后你会发现你被卡常了，于是把 $s(i,j)$ 换成 $s(j,i)$，前面是根号大小寻址更快，就可以无压力过掉了。

```cpp
#include<bits/stdc++.h>
typedef unsigned int ui;
const int border=450;
int n,m,opd,opp,opq;
ui a[200010],s[500][200010],prs[200010],ans;
namespace IO{
    const int sz=1<<22;
    char a[sz+5],b[sz+5],*p1=a,*p2=a,*t=b,p[105];
    inline char gc(){
        return p1==p2?(p2=(p1=a)+fread(a,1,sz,stdin),p1==p2?EOF:*p1++):*p1++;
    }
    template<class T> void gi(T& x){
        x=0; char c=gc();
        for(;c<'0'||c>'9';c=gc());
        for(;c>='0'&&c<='9';c=gc())
            x=(x<<3)+(x<<1)+(c-'0');
    }
    inline void flush(){fwrite(b,1,t-b,stdout),t=b; }
    inline void pc(char x){*t++=x; if(t-b==sz) flush(); }
    template<class T> void pi(T x,char c='\n'){
        if(x<0) x=-x;
        if(x==0) pc('0'); int t=0;
        for(;x;x/=10) p[++t]=x%10+'0';
        for(;t;--t) pc(p[t]); pc(c);
    }
    struct F{~F(){flush();}}f; 
}
using IO::gi;
using IO::pi;
int main()
{
	gi(n);
	for(int i=1;i<=n;++i)	gi(a[i]),prs[i]=prs[i-1]+a[i];
	for(int j=1;j<=border;++j)
	{
		for(int i=1;i<=j;++i)	s[j][i]=a[i];
		for(int i=j+1;i<=n;++i)	s[j][i]=s[j][i-j]+a[i];
	}
	gi(m);
	while(m--)
	{
		gi(opd),gi(opp),gi(opq);
		ans=0;
		for(int i=0;i<opd;++i)	ans+=(s[opd][opp+i+opd*(opd-1)]-s[opd][opp+i]+a[opp+i])*(prs[opq+opd*i+opd-1]-prs[opq+opd*i-1]);
		pi(ans);
	}
	return 0;
}
```
    