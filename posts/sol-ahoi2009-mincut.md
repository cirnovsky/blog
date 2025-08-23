---
date: 2021-12-18
title: 「luogu - P4126」「ahoi 2009」最小割
category: notes
tags: [flows]
---

[link。](https://www.luogu.com.cn/problem/P4126)

也许题不错，反正有点降智…

先给结论，在

$$
V_N=V \\
E_N=E \\
c(x,y)=w(x,y)
$$

的流网络中：

- 可行边：在增广完的 induced subgraph 中，不存在 $u$ 到 $v$ 的**路径**；
- 必要边：在增广完的 induced subgraph 中，可以从 $S$ 到 $u$ 且可以从 $v$ 到 $T$。

先看可行边。不存在 $(u,v)$ 有两个条件，一个是 $c_f(u,v)=0$，另一个是与之并联（特指以 $u$ 为起点，$v$ 为终点的）的线路中存在 $c_f(u',v')=0$。第一个的理解是，如果它没满流，则与之串联的 arcs 中存在比它的容量更小的边，根据最小割串联割最小的原则成立；第二个就是，如果你不把并联的砍了，你的划分压根不合法，何谈可行与否。

那么关于可行边的判断，把图缩点即可。

再看必要边。这个类比可行边即可，不赘述。

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,m,S,T,co[4100],dfsnt,colnt,inst[4100],sta[4100],top,dfn[4100],low[4100],vi[4100],rec[60100];
vector<pair<int,int>> arc;
template<typename T> struct network {
	const int n;
	struct edge {
		int to,r; T w;
//		friend bool operator<(const edge& one,const edge& ano) { return one.to<ano.to || (one.to==ano.to && one.r<ano.r); }
	};
	vector<vector<edge>> e;
	vector<int> lev,iter;
	network(int n):n(n),e(n+1),lev(n+1),iter(n+1) {}
	void link(const int x,const int y,T w,int ID) {
		assert(1<=x && x<=n && 1<=y && y<=n);
		rec[ID]=int(e[x].size());
		e[x].push_back((edge){y,int(e[y].size())+(x==y),w});
		e[y].push_back((edge){x,int(e[x].size())-1,0});
	}
	bool BFS(const int s,const int t) {
		queue<int> q; lev.assign(n+1,0);
		for(q.push(s),lev[s]=1; q.size(); q.pop()) {
			for(int now=q.front(),i=iter[now]=0,y; i<int(e[now].size()); ++i) {
				if(now==t)	return 1;
				if(!lev[y=e[now][i].to] && e[now][i].w)	lev[y]=lev[now]+1,q.push(y);
			}
		}
		return lev[t];
	}
	T DFS(const int now,T f,const int t) {
		if(now==t)	return f;
		T res=0,tt;
		for(int& i=iter[now],y; i<int(e[now].size()); ++i) {
			if(lev[y=e[now][i].to]==lev[now]+1 && e[now][i].w && (tt=DFS(y,min(f,e[now][i].w),t))) {
				e[now][i].w-=tt; e[y][e[now][i].r].w+=tt; res+=tt; f-=tt;
				if(!f)	break;
			}
		}
		if(!res)	lev[now]=0;
		return res;
	}
	T get(const int s,const int t) {
		T res=0;
		while(BFS(s,t))	res+=DFS(s,numeric_limits<T>::max(),t);
		return res;
	}
};
template<typename T=int> T rd() {
	T x=0; char IO=getchar(); bool f=0;
	while(IO<'0' || IO>'9')	f|=IO=='-',IO=getchar();
	while(IO>='0' && IO<='9')	x=x*10+(IO&15),IO=getchar();
	return f?-x:x;
}
void DFS(const int now,const network<int>& G) {
	dfn[now]=low[now]=++dfsnt;
	inst[sta[++top]=now]=1;
	for(int i=0,y; i<int(G.e[now].size()); ++i) {
		if(!G.e[now][i].w)	continue;
		if(!dfn[y=G.e[now][i].to])	DFS(y,G),low[now]=min(low[now],low[y]);
		else if(inst[y])	low[now]=min(low[now],dfn[y]);
	}
	if(dfn[now]==low[now]) {
		++colnt;
		while(sta[top]!=now)	co[sta[top]]=colnt,inst[sta[top]]=0,top--;
		top--; co[now]=colnt; inst[now]=0;
	}
}
void DFS_network(const int now,const network<int>& G,const int c) {
	vi[now]=c;
	for(int i=0,y; i<int(G.e[now].size()); ++i) {
		if(!vi[y=G.e[now][i].to] && (c-1?G.e[y][G.e[now][i].r].w:G.e[now][i].w))	DFS_network(y,G,c);
	}
}
signed main() {
	freopen("mincut.in","r",stdin);
	freopen("mincut.out","w",stdout);
	n=rd(); m=rd(); S=rd(); T=rd();
	network<int> G(n);
	for(int i=0,x,y; i<m; ++i)	x=rd(),y=rd(),G.link(x,y,rd(),i),arc.emplace_back(x,y);
	for(int i=(G.get(S,T),1); i<=n; ++i)	if(!dfn[i])	DFS(i,G);
	DFS_network(S,G,1); DFS_network(T,G,2);
//	for(int i=1; i<=n; ++i)	printf(" --- %d ",vi[i]); puts("\n");
//	for(int i=1; i<=n; ++i)	printf(" --- %d ",co[i]); puts("");
//	for(int i=1; i<=n; ++i)	sort(G.e[i].begin(),G.e[i].end());
//	for(int now=1; now<=n; ++now) {
//		printf(" --- current node = %d:",now);
//		for(int i=0; i<int(G.e[now].size()); ++i)	printf(" %d",G.e[now][i].to);
//		puts("");
//	}
	for(int i=0; i<m; ++i) {
//		printf(" (%d %d)\n",arc[i].first,lower_bound(G.e[arc[i].first].begin(),G.e[arc[i].first].end(),(network<int>::edge){arc[i].second,0,0})->to);
//		if(lower_bound(G.e[arc[i].first].begin(),G.e[arc[i].first].end(),(network<int>::edge){arc[i].second,0,0})->w)	puts("0 0");
//		printf(" (%d %d)[%d %d]\n",arc[i].first,G.e[arc[i].first][rec[i]].to,co[arc[i].first],co[G.e[arc[i].first][rec[i]].to]);
		if(G.e[arc[i].first][rec[i]].w)	puts("0 0");
		else	printf("%d %d\n",co[arc[i].first]!=co[arc[i].second],vi[arc[i].first]==1 && vi[arc[i].second]==2);
	}
	return 0;
}
```
    