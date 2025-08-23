---
date: 2021-12-10
title: Dinic Algorithm Implementation with Huge Constant, and What is Behind It
category: notes
tags: [flows]
---

看向这样一份 Dinic 的实现：

```cpp
#include<bits/stdc++.h>
using namespace std;
template<typename T> struct network {
	const int n;
	struct Arc {
		int to; size_t rev; T w;
	};
	vector<vector<Arc>> e;
	vector<int> lev,iter;
	network(int n):n(n),lev(n),iter(n),e(n) {}
	void add(int one,int ano,T cap) {
		assert(1<=one && one<=n && 1<=ano && ano<=n);
		e[one-1].push_back((Arc){ano-1,e[ano-1].size()+(one==ano),cap});
		e[ano-1].push_back((Arc){one-1,e[one-1].size()-1,0});
	}
	bool bfs(int s,int t) {
		queue<int,list<int>> q;
		lev.assign(n,0);
		for(q.push(s),lev[s]=1; q.size(); q.pop()) {
			for(int now=q.front(),i=iter[now]=0,y; i<int(e[now].size()); ++i) {
				if(now==t)	return 1;
				if(!lev[y=e[now][i].to] && e[now][i].w)	q.push(y),lev[y]=lev[now]+1;
			} 
		}
		return lev[t];
	}
	T dfs(int now,T f,int t) {
		if(now==t)	return f;
		T res=0,tt;
		for(int& i=iter[now],y; i<int(e[now].size()); ++i) {
		    if(!f)	break;
			if(lev[y=e[now][i].to]==lev[now]+1 && e[now][i].w && (tt=dfs(y,min(f,e[now][i].w),t))) {
				e[now][i].w-=tt; e[y][e[now][i].rev].w+=tt; f-=tt; res+=tt;
			}
		}
		if(!res)	lev[now]=0;
		return res;
	}
	T get(int s,int t) {
		assert(1<=s && s<=n && 1<=t && t<=n);
		T res=0,f;
		while(bfs(s-1,t-1)) {
			if((f=dfs(s-1,numeric_limits<T>::max(),t-1)))	res+=f;
			else	break;
		}
		return res;
	}
};
signed main() {
	int n,m,s,t;
	scanf("%d %d %d %d",&n,&m,&s,&t);
	network<long long> G(n);
	for(int i=0,x,y,z; i<m; ++i) {
		scanf("%d %d %d",&x,&y,&z);
		G.add(x,y,z);
	}
	printf("%lld\n",G.get(s,t));
	return 0;
};
```

它在洛谷的最大流模板中取得了 sum runtime 440ms 的傻逼成绩，卡了我至少 4 题的常。

让我们来看看为什么这份实现跑得这么慢。

首先我使用了 `std::size_t` 来储存反向边的编号，然而实际上 `std::size_t`（`std::vector<Type>::size_type`） 在 64-bits 机器中是 `long long unsigned int` 的别名，也即，这个跑得比 `int` 慢多了。

其次是 `std::queue<int, list<int>>`，虽然 -Wallace- 在其 STL 博客中表示这将比 `std::queue<int, deque<int>>` 更快，但事实上至少在这里它跑得很慢……

最后是

```cpp
for(int& i=iter[now],y; i<int(e[now].size()); ++i) {
	if(!f)	break;
	if(lev[y=e[now][i].to]==lev[now]+1 && e[now][i].w && (tt=dfs(y,min(f,e[now][i].w),t))) {
		e[now][i].w-=tt; e[y][e[now][i].rev].w+=tt; f-=tt; res+=tt;
	}
}
```

在经过实验对比（指，摸到 loj 势力上看了下为啥神户的板子跑这么快）后，我们惊讶的发现，下面代码所呈现的跑进了 50ms

```cpp
for(int& i=iter[now],y; i<int(e[now].size()); ++i) {
	if(lev[y=e[now][i].to]==lev[now]+1 && e[now][i].w && (tt=dfs(y,min(f,e[now][i].w),t))) {
		e[now][i].w-=tt; e[y][e[now][i].rev].w+=tt; f-=tt; res+=tt;
		if(!f)	break;
	}
}
```

起初我以为是我的 $f$ 可能变成负数，但理论和事实都给了我两耳巴子。然后我怀疑是 `std::vector<Type>::size()` 的问题，但依然没有区别。

最后的怀疑是 `++i` 的效率问题

```cpp
for(int& i=iter[now],y; i<int(e[now].size()); ++i) {
	if(lev[y=e[now][i].to]==lev[now]+1 && e[now][i].w && (tt=dfs(y,min(f,e[now][i].w),t))) {
		e[now][i].w-=tt; e[y][e[now][i].rev].w+=tt; f-=tt; res+=tt;
		if(!f)	{++i; break;}
	}
}
```

飘成了 400ms，破案了？

不，再看

```cpp
for(int i=iter[now],y; i<int(e[now].size()); ++i) {
	iter[now]=i;
	if(lev[y=e[now][i].to]==lev[now]+1 && e[now][i].w && (tt=dfs(y,min(f,e[now][i].w),t))) {
		e[now][i].w-=tt; e[y][e[now][i].rev].w+=tt; f-=tt; res+=tt;
		if(!f)	{++i; break;}
	}
}
```

又跑进了 50ms，现在明了了，`iter`（`std::vector<int>`）的寻址太慢，并且剪枝剪掉的情况确实比较多，所以效率很低。
    