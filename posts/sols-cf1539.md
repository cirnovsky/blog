---
date: 2021-06-21
title: Solution Set -「CF 1539」
category: notes
tags: [maths,data-structures,greedy,brute-force]
---

> 我是傻逼。

# 「CF 1539A」Contest Start

[Link](https://codeforces.com/contest/1539/problem/A).

答案是 $\sum_{i=1}^{n-1}\min\{i,\lfloor\frac{t}{x}\rfloor\}$，等差数列求和优化。

<details>

```cpp
#include<bits/stdc++.h>
#define con(typ) const typ
typedef long long ll;
#define all(x) (x).begin(),(x).end()
using namespace std;
template<typename T>void sf(T &x){x=0;T f=0;char c=getchar();for(;c<'0'||c>'9';c=getchar())if(c=='-')f=1;for(;c>='0'&&c<='9';c=getchar())x=(x<<3)+(x<<1)+(c^'0');if(f)x=-x;}
template<typename T>void pf(T x,char l='\n'){static int s[100],t;if(x<0)putchar('-'),x=-x;do s[++t]=x%10,x/=10;while(x);while(t)putchar(s[t--]^'0');putchar(l);}
int main(){
	int T;
	ll n,x,t;
	for(sf(T);T;--T){
		sf(n),sf(x),sf(t);
		ll ans=0,d=t/x;
		--n;
		if(n>=d)ans=(n-d)*d+d*(d+1)/2;
		else ans=n*(n+1)/2;
		pf(ans);
	}
	return 0;
}
```

</details>

# 「CF 1539B」Love Song

[Link](https://codeforces.com/contest/1539/problem/B).

暴力。

<details>

```cpp
#include<bits/stdc++.h>
#define con(typ) const typ
typedef long long ll;
#define all(x) (x).begin(),(x).end()
using namespace std;
template<typename T>void sf(T &x){x=0;T f=0;char c=getchar();for(;c<'0'||c>'9';c=getchar())if(c=='-')f=1;for(;c>='0'&&c<='9';c=getchar())x=(x<<3)+(x<<1)+(c^'0');if(f)x=-x;}
template<typename T>void pf(T x,char l='\n'){static int s[100],t;if(x<0)putchar('-'),x=-x;do s[++t]=x%10,x/=10;while(x);while(t)putchar(s[t--]^'0');putchar(l);}
int cap[100010][26],n,q;
char ch[100010];
int main(){
	sf(n),sf(q);
	scanf("%s",ch+1);
	for(int i=1;i<=n;++i){
		memcpy(cap[i],cap[i-1],sizeof(int)*26);
		cap[i][ch[i]-'a']++;
	}
	for(int l,r;q;--q){
		sf(l),sf(r);
		ll ans=0;
		for(int i=0;i<26;++i)ans+=(i+1)*(cap[r][i]-cap[l-1][i]);
		pf(ans);
	}
	return 0;
}
```

</details>

# 「CF 1539C」Stable Groups

[Link](https://codeforces.com/contest/1539/problem/C).

贪心。

对原序列差分，把差分值拿出来排序后把前几个填了。正确性显然。

<details>

```cpp
#include<bits/stdc++.h>
#define con(typ) const typ
typedef long long ll;
#define all(x) (x).begin(),(x).end()
using namespace std;
template<typename T>void sf(T &x){x=0;T f=0;char c=getchar();for(;c<'0'||c>'9';c=getchar())if(c=='-')f=1;for(;c>='0'&&c<='9';c=getchar())x=(x<<3)+(x<<1)+(c^'0');if(f)x=-x;}
template<typename T>void pf(T x,char l='\n'){static int s[100],t;if(x<0)putchar('-'),x=-x;do s[++t]=x%10,x/=10;while(x);while(t)putchar(s[t--]^'0');putchar(l);}
int n;
ll a[200010],k,x,df[200010];
int main(){
	sf(n);sf(k);sf(x);for(int i=1;i<=n;++i)sf(a[i]);
	sort(a+1,a+n+1);
	for(int i=2;i<=n;++i)df[i]=a[i]-a[i-1];
	vector<ll> ald;
	for(int i=2;i<=n;++i){
		if(df[i]>x)ald.emplace_back(df[i]);
	}
	sort(all(ald));
	int del=0;
	for(int i=0;i<int(ald.size());++i){
		ll w=ald[i];
		if(w%x==0){
			if(k>=w/x-1)k-=w/x-1,++del;
			else break;
		}
		else{
			if(k>=w/x)k-=w/x,++del;
			else break;
		}
	}
	pf(int(ald.size())-del+1);
	return 0;
}
```

</details>

# 「CF 1539D」PriceFixed

[Link](https://codeforces.com/contest/1539/problem/D).

以 $b$ 为关键字排序。

首先考虑把第一个元素「激活」，即填满 $b_{1}$ 个商品。

然后后面的元素有两种决策：

1. 使用前面已经「激活」的商品来「激活」该商品后买完；
2. 直接买 $a_{i}$ 个，注意分 $a_{i},b_{i}$ 大小讨论。

两种决策会使总买入商品数不一致，对后面有影响（？）。

现在考场上那个傻逼在想 DP。

但是注意到这样搞的代价是没有差别的，$2-1=1$ 抵了。

那么就一定存在一种最优方案使得每种产品买恰好 $a_{i}$ 个，搞两个指针扫一下就行了。

<details>

```cpp
#include<bits/stdc++.h>
#define con(typ) const typ
typedef long long ll;
#define all(x) (x).begin(),(x).end()
using namespace std;
template<typename T>void sf(T &x){x=0;T f=0;char c=getchar();for(;c<'0'||c>'9';c=getchar())if(c=='-')f=1;for(;c>='0'&&c<='9';c=getchar())x=(x<<3)+(x<<1)+(c^'0');if(f)x=-x;}
template<typename T>void pf(T x,char l='\n'){static int s[100],t;if(x<0)putchar('-'),x=-x;do s[++t]=x%10,x/=10;while(x);while(t)putchar(s[t--]^'0');putchar(l);}
struct st{ll a,b;}a[100010];
int n;
int main(){
	sf(n);for(int i=1;i<=n;++i)sf(a[i].a),sf(a[i].b);
	sort(a+1,a+n+1,[](st x,st y){return x.b<y.b || (x.b==y.b && x.a<y.a);});
	ll nw=0,ans=0;
	for(int i=1,j=n;i<=j;){
		if(nw>=a[i].b){
			ans+=a[i].a;
			nw+=a[i].a;
			++i;
		}
		else{
			if(a[j].a+nw>=a[i].b){
                ll temp=a[i].b-nw;
                ans+=2*temp;
                nw+=temp;
                a[j].a-=temp;
			}
			else{
				ans+=a[j].a*2;
				nw+=a[j].a;
				--j;
			}
		}
	}
	pf(ans);
	return 0;
}
```

</details>

# 「CF 1539E」Game with Cards

[Link](https://codeforces.com/contest/1539/problem/E).

gap 略大。搞不动先咕着。

<details>

```cpp

```

</details>

# 「CF 1539F」Strange Array

[Link](https://codeforces.com/contest/1539/problem/F).

假的，懒得写了，具体看 Rainybunny 的评论吧。

>$\ \ \ \ $F：发现对于某个 $a_{i}$，已知包含它的某个区间中，$\le a_{i}$ 与 $>a_{i}$ 的数的数量差就能得到它的特征值。不妨令“大于等于”为 $+1$，“小于”为 $-1$，线段树维护区间最大前缀和与最大后缀和，升序扫描 $a$ 值就能更新答案。$+1,-1$ 反过来再做一遍，最后是 $\mathcal O(n\log_{2}n)$ 的。
>$\ \ \ \ $赛后瞬间补题的原因大概是细节有点多√

<details>

```cpp
#include<bits/stdc++.h>
#define con(typ) const typ
typedef long long ll;
#define all(x) (x).begin(),(x).end()
using namespace std;
template<typename T>void sf(T &x){x=0;T f=0;char c=getchar();for(;c<'0'||c>'9';c=getchar())if(c=='-')f=1;for(;c>='0'&&c<='9';c=getchar())x=(x<<3)+(x<<1)+(c^'0');if(f)x=-x;}
template<typename T>void pf(T x,char l='\n'){static int s[100],t;if(x<0)putchar('-'),x=-x;do s[++t]=x%10,x/=10;while(x);while(t)putchar(s[t--]^'0');putchar(l);}
template<typename T,typename... Tt>void sf(T &x,Tt&... aa){sf(x),sf(aa...);}
int n,a[200010],stp,Segres;
vector<int> ps[200010];
struct node{int p,s,sm;node(int a=0,int b=0,int c=0){p=a;s=b;sm=c;}};
struct Segtree{
	const int n;
	vector<node> ns;
	Segtree(int n,int fl):n(n),ns(n*4+5){give(1,n,1,fl);}
	node mrg(node a,node b){
		node c;
		c.p=max(a.p,a.sm+b.p);
		c.s=max(b.s,b.sm+a.s);
		c.sm=a.sm+b.sm;
		return c;
	}
	void give(int l,int r,int p,int v){
		if(r-l==0){ns[p]=node(max(v,0),max(v,0),v);return;}
		int m=(l+r)/2;
		give(l,m,p*2,v),give(m+1,r,p*2+1,v);
		ns[p]=mrg(ns[p*2],ns[p*2+1]);
	}
	void ins(int l,int r,int p,int x,int v){
		if(r-l==0){ns[p]=node(max(v,0),max(v,0),v);return;}
		int m=(l+r)/2;
		if(m>=x)ins(l,m,p*2,x,v);
		else ins(m+1,r,p*2+1,x,v);
		ns[p]=mrg(ns[p*2],ns[p*2+1]);
	}
	void qpre(int l,int r,int p,int x){
		if(l>=x){stp=max(stp,Segres+ns[p].p);Segres+=ns[p].sm;return;}
		int m=(l+r)/2;
		if(m>=x)qpre(l,m,p*2,x);qpre(m+1,r,p*2+1,x);
	}
	void qsuf(int l,int r,int p,int x){
		if(r<=x){stp=max(stp,Segres+ns[p].s);Segres+=ns[p].sm;return;}
		int m=(l+r)/2;
		if(m<x)qsuf(m+1,r,p*2+1,x);qsuf(l,m,p*2,x);
	}
	void ins(int x,int y){ins(1,n,1,x,y);}
	int qpre(int x){Segres=stp=0;qpre(1,n,1,x);return stp;}
	int qsuf(int x){Segres=stp=0;qsuf(1,n,1,x);return stp;}
};
int main(){
	sf(n);for(int i=1;i<=n;++i)sf(a[i]),ps[a[i]].emplace_back(i);
	int value=1;
	vector<int> ans(n);
	for(int value=1;value>-2;value-=2){
		Segtree t(n,value);
		for(int i=1;i<=n;++i){
			if(value==-1)for(int x:ps[i])t.ins(x,-value);
			for(int x:ps[i]){
				int r0,r1;
				r1=t.qpre(x);
				r0=t.qsuf(x);
				if((r0+r1-1)&1)ans[x-1]=max(ans[x-1],(r0+r1-1)/2);
				else{
					if(value==1)ans[x-1]=max(ans[x-1],(r0+r1-1)/2);
					else ans[x-1]=max(ans[x-1],(r0+r1-2)/2);
				}
			}
			if(value==1)for(int x:ps[i])t.ins(x,-value);
		}
	}
	for(int x:ans)pf(x,' ');
	return 0;
}
```

</details>
    