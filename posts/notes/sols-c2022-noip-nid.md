---
date: '2019-10-06'
title: 'Solution Set -「新初二 NOIP 国庆热身水题赛」'

---

### 今天的热身赛的题很有质量!



### T1



`题面：`

```
现在，存在一组激光编号，需要从中挑选出来k个组成素数，并且可能存在多种方案，所以你需要知道至少要尝

试多少种组合才能破解这个机关，至于如何破解，那就是神兽的程序的问题了。
```



### 思路:

​		暴搜没得说

### 代码:

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

int n, k, ans;
int a[20 + 5];

inline bool isPrime(int x)
{
	for (int i = 2; i * i <= x; ++i)
		if (!(x % i)) return false;
	return true;
}

inline void DFS(int now, int sum, int tot)
{
	if (tot == k)
	{
		if (isPrime(sum))
			ans++;
		return ;
	}
	if (now == n + 1)
		return ;
	DFS(now + 1, sum + a[now], tot + 1);
	DFS(now + 1, sum, tot);
}

signed main()
{
	scanf("%d%d", &n, &k);
	for (int i = 1; i <= n; ++i)scanf("%d",&a[i]);
	DFS(1, 0, 0);
	printf("%d\n", ans);
	return 0;
}
```



### T2



`题面:`

`
这里的防御系统要求所有的资料会在第k次全部弹出，但是每份资料的重量可能不同，且必须按照既定的顺序选择每一次弹出的资料，每一次至少弹出一份资料，上不封顶，但是神兽希望最重的那组资料重量在他们的承受范围之内，所以要求最重的那组资料尽可能轻。
`



### 思路

```
虽然读题读了很久，但还好看出了这是一道二分答案的题目
```



### 代码

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const long long MAXN = 1e6 + 10;

long long n, k;
long long a[MAXN];

long long check(long long rhs) {
    long long res = 0;
    long long tot = 0;
    for (long long i = 1; i <= n; ++i) {
        if (tot + a[i] > rhs) {
            tot = 0;
            res++;
        }
        tot += a[i];
    }

    return res + 1;
}

signed main()
{
    scanf("%lld%lld", &n, &k);
    long long l = 0, r = 1e16;
    for (long long i = 1; i <= n; i++)
        scanf("%lld", &a[i]),
        l = max(l, a[i]);

    while (l < r)
	{
        long long mid = (l + r) / 2;
        if (check(mid) <= k) r = mid;
        else l = mid + 1;
    }

    printf("%lld", l);
    return 0;
}
```



### T3



### 题面



`
神兽思考片刻，突然想到了自己设计的一套程序就是针对自动化武器的，而且如果这些武器联网，还能达到传播歼灭所有网内系统的效果，但是每次传播都需要神兽亲自完成，并花费大量时间，当然每次部署一个武器也会花费大量时间，神兽可以选择联网系统中的一部分系统进行部署，剩下的可以由他来传播(由于只能由神兽完成部署和传播，所以所有操作不能同时进行)
`



### 思路



```
这道题一看就是最小生成树。板子题没什么可讲的
```



### 代码



```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <climits>
#include <queue>

using namespace std;

const int MAXN = 90000 + 5;
int cost[MAXN];
struct Edge
{
	int u;
	int v;
	int w;
	
    bool operator < (const Edge &rhs) const { return w < rhs.w; }
} edge[MAXN];

int fa[MAXN];

inline void init(int n)
{
	for (int i = 0; i < n; ++i)	fa[i] = i;
}

inline int find(int x)
{
	if (x ^ fa[x]) fa[x] = find(fa[x]);
	return fa[x];
}

inline void union_(int x, int y)
{
	int u = find(x), v = find(y);
	if (u ^ v) fa[u] = v;
}

int n, m;
signed main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
	{
		int cost;
		scanf("%d", &cost);
		edge[m++] = Edge{0, i, cost};
	}
	
	for (int i = 1; i <= n; ++i)
		for (int j = 1; j <= n; ++j)
		{
			int cost;
			scanf("%d", &cost);
			if (j > i) edge[m++] = Edge{i, j, cost};
		}
		
	++n;
	sort(edge, edge + m);
	init(n);
	int ans = 0, src = 0;
	for (int i = 0; i < m; ++i)
	{
		if (find(edge[i].u) != find(edge[i].v))
		{
			union_(edge[i].u, edge[i].v);
			ans += edge[i].w;
			src++;
			if (src == n - 1) break;
		}
	}
	printf("%d", ans);
	return 0;
}
```



### T4



### 题面



`
小L在上学路上不幸掉入了一口井深D英尺的深井中，不幸的是，他只能靠吃掉到井里的东西来维持生命了，但幸运的是，每隔一段时间小T就会往井里丢东西，小L可以选择用这些东西垫在脚下尝试着爬出井口或者吃掉它们来续命，被垫在脚下的东西就不能再吃了，当然吃过的东西也不能再垫在脚下。当小L的高度和井口高度一样高的时候，他就可以爬出井口了。小L预先知道了一共会有N个东西被丢下来，并且他还知道了他们的掉落时间，高度以及能够维持生命的时间长度。
　　一开始，小L体内的能量能够维持10个单位时间的生命。
`



### 思路

`
这是一道dp题。似乎贪心也能过？？

设dp[i][j]为第i个物品掉下时，小L的高度为j时的最大生命值

可推出转移方程：

dp[i + 1][j + A[i].height] = max(dp[i + 1][j + A[i].height], dp[i][j] - qq);

dp[i + 1][j] = max(dp[i + 1][j], dp[i][j] - qq + A[i].life_num);

其中qq为后一个物品掉落的时间与当前凋落物出现时间差
`



### 代码



```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <climits>
#include <queue>

using namespace std;

const int MAXN = 1000 + 5;
int High, n;
int dp[MAXN][MAXN / 3];
struct node
{
	int app_tim;
	int life_num;
	int height;
	
	bool operator < (const node &rhs) const { return app_tim < rhs.app_tim; }
} A[MAXN];

signed main()
{
	scanf("%d%d", &High, &n);
	for (int i = 1; i <= n; ++i)
	{
		scanf("%d", &A[i].app_tim);
		scanf("%d", &A[i].life_num);
		scanf("%d", &A[i].height);
	}
	sort(A + 1, A + 1 + n);
	memset(dp, -1, sizeof dp);
	dp[0][0] = 10;
	int ans = 0;
	for (int i = 0; i <= n; ++i)
	{
		int qq = A[i + 1].app_tim - A[i].app_tim;
		for (int j = 0; j <= High; ++j)
		{
			if (dp[i][j] < 0) continue;
			dp[i + 1][j + A[i].height] = max(dp[i + 1][j + A[i].height], dp[i][j] - qq);
			dp[i + 1][j] = max(dp[i + 1][j], dp[i][j] - qq + A[i].life_num);
			if (j + A[i].height >= High)
				return printf("%d\n", A[i].app_tim) & 0;
		}
		if (dp[i][0] >= 0)
			ans = max(ans, dp[i][0] + A[i].life_num + A[i].app_tim);
	}
	printf("%d\n", ans);
	return 0;
}
```



### T5



### 思路

`
首先这肯定是一个图，因为A, B, C点的位置不确定。
所以我们先跑一个最短路确定C点，然后再跑两个最短路确定B,
 C点的位置，最后统计A~C和B~C谁的距离比较小输出即可
`



### 代码

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>
#include <set>
#include <map>
#include <utility>
#include <cctype>
#include <climits>
#define Int long long
#define oo LONG_LONG_MAX

using namespace std;

const int MAXN = 200000 + 5;
int n, m;
struct Edge
{
	int v;
	Int w;
};
vector<Edge> G[MAXN];
bool vis[MAXN];
Int dis[3][MAXN];

inline void pushEdge(int u, int v, Int w)
{
	G[u].push_back(Edge{v, w});
	G[v].push_back(Edge{u, w});
}

inline void init(int k)
{
	for (int i = 1; i <= n; ++i)
	{
		dis[k][i] = oo;
		vis[i] = 0; 
	}
}

inline void BFS(int s, int t)
{
	init(s);
	dis[s][t] = 0;
	vis[t] = 1;
	queue<int> Q;
	Q.push(t);
	while (!Q.empty())
	{
		int u = Q.front();
		Q.pop();
		vis[u] = false;
		for (int i = 0; i < (int)G[u].size(); ++i)
		{
			int v = G[u][i].v;
			int w = G[u][i].w;
			if (dis[s][v] > dis[s][u] + w)
			{
				dis[s][v] = dis[s][u] + w;
				if (!vis[v])
				{
					vis[v] = true;
					Q.push(v);
				}
			}
		}
	}
}

signed main()
{
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= m; ++i)
	{
		int u, v;
		Int w;
		scanf("%d%d%lld", &u, &v, &w);
		pushEdge(u, v, w);
	}
	Int ans1 = 0;
	int Node1 = 0;
	BFS(0, 1);
	for (int i = 1; i <= n; ++i)
		if (dis[0][i] > ans1)
			ans1 = dis[0][i],
			Node1 = i;
	BFS(1, Node1);
	Int ans2 = 0;
	int Node2 = 0;
	for (int i = 1; i <= n; ++i)
		if (dis[1][i] > ans2)
			ans2 = dis[1][i],
			Node2 = i;
	BFS(2, Node2);
	Int ans3 = 0;
	for (int i = 1; i <= n; ++i)
		if (i != Node1 && i != Node2)
			ans3 = max(ans3, min(dis[1][i], dis[2][i]));
	
	printf("%lld\n", ans3 + ans2);
}
```



### T7



### 思路

`
这道题...做过的吧？

没错就是那个泥泞的牧场。

没有做的同学看了这篇题解估计两道题都能做。

首先我们从泥泞的牧场讲起:

   此题的难点在于如何去建图。

   很显然我们需要把行和列分别当成二分图的两部分
   。
   所以我们可以分别把一个点行的连通块和列的连通块处理出来。

   每次发现一个点就把编一个号，然后就可以把图构建出来了！
   
T7只是在泥泞的牧场上加了一个判断而已
`





### 代码

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int MAXN = 1000 + 5;
int n, m, R, C;
char str[MAXN][MAXN];
int G[MAXN][MAXN], match[MAXN];
int row[MAXN][MAXN];
int vis[MAXN], col[MAXN][MAXN];

inline bool DFS(int k)
{
	for (int i = 1; i <= C; ++i)
	{
		if (G[k][i] && !vis[i])
		{
			vis[i] = true;
			if (!match[i] || DFS(match[i]))
				return (match[i] = k) * 0 + 1;
		}
	}
	return 0;
}

signed main()
{
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; ++i)
		scanf("%s", str[i] + 1);
	int t_sum = 0;
	for (int i = 1; i <= n; ++i)
	{
		for (int j = 1; j <= m; ++j)
		{
			if (str[i][j] == '*')
			{
				++t_sum;
				while ((str[i][j] == 'x' || str[i][j] == '*') && j <= m) row[i][j] = t_sum, ++j;
			}
		}
	}
	R = t_sum;
	t_sum = 0;
	for (int j = 1; j <= m; ++j)
	{
		for (int i = 1; i <= n; ++i)
		{
			if (str[i][j] == '*')
			{
				++t_sum;
				while ((str[i][j] == 'x' || str[i][j] == '*') && i <= n) col[i][j] = t_sum, ++i;
			}
		}
	}
	C = t_sum;
	for (int i = 1; i <= n; ++i)
		for (int j = 1; j <= m; ++j)
			if (str[i][j] == '*')
				G[row[i][j]][col[i][j]] = 1;
	int ans = 0;
	for (int i = 1; i <= R; ++i)
	{
		memset(vis, 0, sizeof vis);
		if (DFS(i)) ans++;
	}
	printf("%d\n", ans);
}
```



### T7



### 思路

```
这题似乎是一个分治？？
但经过观察我们可以发现以下规律：
    如果最后的温度大于等于最大的温度值，输出possible和最后的温度
	如果最后的温度不大于最小的温度值，输出possible和最小值
	否则输出Impossible。
```



### 代码



```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

int n;
double T, C;
double t, c;
const auto MAX = 1e17;

signed main()
{
	double _min = MAX, _max = -MAX;
	scanf("%d", &n);
	scanf("%lf%lf", &T, &C);
	for (int i = 1; i <= n; ++i)
	{
		scanf("%lf%lf", &t, &c);
		T = (T * C + t * c) / (c + C);
		C += c;
		_min = min(_min, t);
		_max = max(_max, t);
	}
	if (T >= _max) printf("Possible\n%.4lf", T);
	else if (T <= _min) printf("Possible\n%.4lf", _min);
	else puts("Impossible");
	return 0;
}
```

