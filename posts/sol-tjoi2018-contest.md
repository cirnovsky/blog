---
date: 2022-01-02
title: 「tjoi 2018」智力竞赛
category: notes
tags: [binary-search,graph-theory]
---

[link。](https://loj.ac/p/2574)

这题数据应该蛮水的，直接把大于二分值的点去掉实际上应该是有问题的。然而题解区里都写的是这种做法，所以这里主要对如何处理大于二分值的点做分析。

注意这里大于二分值的点的意义是「可以走，但走了不贡献」，因此可能对最小路径覆盖的去除其为起点 / 终点的操作次数影响。处理方法应该为把大于二分值的点左部和右部之间连，即连 $(u_s,u_t),v_u>mid$。

然后就是其他题解的做法了，二分后跑最小路径覆盖即可。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define cmin(x, y) x = min(x, y)
#define cmax(x, y) x = max(x, y)
template<typename T=int> T read() {
	T x=0; char IO=getchar(); bool f=0;
	while(IO<'0' || IO>'9')	f|=IO=='-',IO=getchar();
	while(IO>='0' && IO<='9')	x=x*10+(IO&15),IO=getchar();
	return f?-x:x;
}
int n,K,mat[1100],vis[1100],dp[600][600],dp2[600][600],a[600];
vector<vector<int>> e;
void add(const int one,const int ano) {
	e[one].push_back(ano);
}
bool DFS(const int now) {
	assert(now < int(e.size()));
	if(vis[now]) return 0;
	vis[now] = 1;
	for(const int y : e[now]) if(!mat[y] || DFS(mat[y])) return bool((mat[y] = now,1));
	return 0;
}
bool check(const int cur) {
	vector<vector<int>>().swap(e);
	memset(dp2, 0, sizeof dp2);
	memset(mat, 0, sizeof mat);
	e.resize(n + 5);
	int res = 0;
	for(int i=1; i<=n; ++i) {
		for(int j=1; j<=n; ++j) {
			if(dp[i][j] && ((a[i] <= cur && a[j] <= cur) || i == j)) dp2[i][j] = 1;
		}
	}
	for(int i=1; i<=n; ++i) if(a[i] > cur) dp2[i][i] = 1;
	for(int k=1; k<=n; ++k) {
		for(int i=1; i<=n; ++i) {
			for(int j=1; j<=n; ++j) dp2[i][j] |= dp2[i][k]&dp2[k][j];
		}
	}
	for(int i=1; i<=n; ++i) {
		for(int j=1; j<=n; ++j) if(dp2[i][j]) add(i, j);
	}
	for(int i=1; i<=n; ++i) memset(vis+1, 0, n<<2),res += DFS(i);
	return n - res <= K;
}
signed main() {
	K = read() + 1,n = read();
	int l = 1e9,r = 0;
	for(int i=1,k; i<=n; ++i) {
		a[i] = read(),k = read();
		cmin(l, a[i]),cmax(r, a[i]);
		while(k--) dp[i][read()] = 1;
	}
	for(int k=1; k<=n; ++k) {
		for(int i=1; i<=n; ++i) {
			for(int j=1; j<=n; ++j) if(i != j) dp[i][j] |= dp[i][k]&dp[k][j];
		}
	}
	int tmp = r;
	for(int mid; l <= r;) {
		mid = (l + r)>>1;
		if(check(mid)) l = mid + 1;
		else r = mid - 1;
	}
	if(l > tmp) puts("AK");
	else printf("%d\n", l);
	return 0;
}
```
    