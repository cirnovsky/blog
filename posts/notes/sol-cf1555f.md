---
date: '2021-07-31'
title: 'Solution -「CF 1555F」Good Graph'
category: 'Notes'
---

来一个不用 HLD / LCT 的做法。~~其实没有什么本质上的差别~~

首先容易想到离线，并且满足条件的图一定是边仙人掌，我们把离线后得到的图缩点，形成一片森林，并且标记树边。树边显然必选，主要来看非树边。

维护 $pre(x)$ 表示从根到 $x$ 的边权异或和，设当前我们考虑的非树边是 $(x,y)$，那么如果 $x,y$ 已经处于同一个环里或者 $pre(x)\oplus pre(y)\oplus w(x,y)\neq1$ 是不行的，否则就可以加进去。

然后怎么实现查找是否在同一个环里之类的就用 time-stamp & BIT 解决。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=300100,M=500100;
int n,m,ix[M],iy[M],iw[M],sjc,fa[20][N],indfn[N],outdfn[N],tag[M],dep[N],pre[N];
vector<pair<int,int>> G[N];
void dfs(int x,int las)
{
	fa[0][x]=las;
	indfn[x]=++sjc;
	dep[x]=dep[las]+1;
	for(int i=1; i<20; ++i) fa[i][x]=fa[i-1][fa[i-1][x]];
	for(auto [y,w]:G[x])	if(y!=las)	pre[y]=pre[x]^w,dfs(y,x);
	outdfn[x]=sjc;
}
int fwk[N];
void ins(int x,int y) { for(; x<=n; x+=x&-x)	fwk[x]+=y; }
int find(int x)
{
	int res=0;
	for(; x; x-=x&-x)  res+=fwk[x];
	return res;
}
int lh[N];
int dsuFind(int x)
{
	while(x!=lh[x])	x=lh[x]=lh[lh[x]];
	return x;
}
int LCA(int x,int y)
{
	if(dep[x]<dep[y])	swap(x,y);
	for(int i=19; ~i; --i)	if(dep[fa[i][x]]>=dep[y])	x=fa[i][x];
	if(x==y)	return x;
	for(int i=19; ~i; --i)	if(fa[i][x]!=fa[i][y])	x=fa[i][x],y=fa[i][y];
	return fa[0][x];
}
signed main() {
	ios_base::sync_with_stdio(false);
	cin.tie(nullptr),cout.tie(nullptr);
	cin>>n>>m;
	iota(lh+1,lh+n+1,1);
	for(int i=1; i<=m; ++i)
	{
		cin>>ix[i]>>iy[i]>>iw[i];
		int x=dsuFind(ix[i]),y=dsuFind(iy[i]);
		if(x!=y)
		{
			G[ix[i]].emplace_back(iy[i],iw[i]);
			G[iy[i]].emplace_back(ix[i],iw[i]);
			tag[i]=1,lh[x]=y;
		}
	}
	for(int i=1; i<=n; ++i)	if(!dep[i])	dfs(i,0);
	for(int i=1; i<=m; ++i)
	{
		if(tag[i])	cout<<"YES\n";
		else
		{
			int x=ix[i],y=iy[i];
			if(find(indfn[x])+find(indfn[y])-find(indfn[LCA(x,y)])*2>0||(pre[x]^pre[y]^iw[i])!=1)	cout<<"NO\n";
			else
			{
				cout<<"YES\n";
				while(x!=y)	(dep[x]<dep[y])&&(x^=y^=x^=y),ins(indfn[x],1),ins(outdfn[x]+1,-1),x=fa[0][x];
			}
		}
	}
	return 0;
}
```