---
date: '2019-12-01'
title: 'Solution Set -「CSP-J 2019」'
category: 'Notes'
---

这次的CSP是十分伤心的，考试的状态不好，导致分数不理想。

睡了一觉后我重做了一下这四道题，觉得还是蛮简单的，于是便有了这篇题解。


## T1

统计1的数量，字符串模拟即可

```cpp
#include <bits/stdc++.h>

using namespace std;

char buf[233];

signed main() {
    fgets(buf, 233, stdin);
    int res = 0;
    for (int i = 0; i < 8; ++i)
        res += (buf[i] == '1');
    printf("%d", res);
}
```

## T2

这道题是最亏的，STL是个好东西，但容易遗忘一些细节。比如erase后没有减掉下标。

模拟即可，用一个数组或vector存储优惠票，每次坐地铁的时候扫描一下。

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>

using namespace std;

vector < pair < int , int > > vec;
const int MAXN = 1e5 + 5;
struct NODE {
    int ID;
    int Pri;
    int Tim;
} a[MAXN];
int n;
int ans;

signed main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        int x, y, z;
        scanf("%d%d%d", &x, &y, &z);
        a[i] = NODE{x, y, z};
        if (!a[i].ID) {
            ans += a[i].Pri;
            vec.push_back(make_pair(a[i].Pri, a[i].Tim));
            continue;
        }
        int Flag = false;
        for (int j = 0; j < vec.size(); ++j) {
            if (abs(a[i].Tim - vec[j].second) <= 45 && vec[j].first >= a[i].Pri) {
                vec.erase(vec.begin() + j);
                --j;
                Flag = true;
                break;
            }
            if (abs(a[i].Tim - vec[j].second) > 45)
                vec.erase(vec.begin() + j), --j;
        }
        if (!Flag) ans += a[i].Pri;
    }
    printf("%d\n", ans);
}
```

## T3

完全背包的题

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>
#include <vector>
#include <string>
#include <utility>
#define _ 0

using namespace std;

inline int read() {
	int a = 0, f = 1; char ch;
	while (!isdigit(ch = getchar())) if (ch == '-') f = -1;
	while (isdigit(ch)) a = (a << 3) + (a << 1) + (ch ^ '0'), ch = getchar();
	return a * f;
}

template<typename _T>
inline void write(_T x) {
	if (x < 0) x = -x, putchar('-');
	if (x > 9) write(x /10);
	putchar(x % 10 + '0');
}

const int MAXN = 233333 + 5;
int T = read();
int n = read();
int m = read();
int o233[105][105];
int dp[MAXN];

signed main() {
	for (int i = 1; i <= T; ++i)
		for (int j = 1; j <= n; ++j)
			o233[i][j] = read();
	
	int ans = m;
	for (int i = 1; i <= T; ++i) {
		memset(dp, ~~(0^_^0), sizeof dp);
		dp[ans] = ans;
		for (int j = 1; j <= n; ++j)
			for (int k = ans; k >= o233[i][j]; --k)
				dp[k - o233[i][j]] = max(dp[k - o233[i][j]], dp[k] + o233[i + 1][j] - o233[i][j]);
		
		int maxNum = -2333333;
		for (int ljs = ~~(0^_^0); ljs <= ans; ++ljs)
			maxNum = max(maxNum, dp[ljs]);
		ans = maxNum;
	}
	write(ans);
	return 0;
}
```

## T4

这道题还没有T3难

对这个图跑一遍Dijkstra或SPFA，（这次的数据不知道有没有卡SPFA）处理出所有点到原点的奇数最短路和偶数最短路。

因为边权一直为1，所以只需要用当前的奇数最短路更新偶数最短路，用当前的偶数最短路更新奇数最短路就行了。

有一个坑点在于，若源点是独立的，也就是说若1号结点没有出入度，那么这种情况是一直输出No

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>
#include <vector>
#include <string>
#include <utility>

using namespace std;

inline int read() {
	int a = 0, f = 1; char ch;
	while (!isdigit(ch = getchar())) if (ch == '-') f = -1;
	while (isdigit(ch)) a = (a << 3) + (a << 1) + (ch ^ '0'), ch = getchar();
	return a * f;
}

template<typename _T>
inline void write(_T x) {
	if (x < 0) putchar('-'), x = -x;
	if (9 < x) write(x / 10);
	putchar(x % 10 + '0');
}

const int MAXN = 1e5 + 5;
struct UndirectedGraph {
	long long OddDis;
	long long EvenDis;
} dis[MAXN];
int head[MAXN << 1], _next[MAXN << 1];
int ver[MAXN << 1], edge[MAXN << 1];
int tot;
int n = read();
int m = read();
int q = read();

inline void addEdge(int x, int y, int z) {
	ver[++tot] = y, edge[tot] = z;
	_next[tot] = head[x], head[x] = tot;
}

inline void SPFA() {
	for (int i = 1; i <= n; ++i)
		dis[i].EvenDis = dis[i].OddDis = 0x7fffffff;
	queue<int> Q;
	Q.push(1);
	dis[1].EvenDis = 0;
	while (Q.size()) {
		int x = Q.front(); Q.pop();
		for (int i = head[x]; i; i = _next[i]) {
			int y = ver[i];
			int z = edge[i];
			int OddDis = dis[y].OddDis;
			int EvenDis = dis[y].EvenDis;
			dis[y].OddDis = min(dis[y].OddDis, dis[x].EvenDis + z);
			dis[y].EvenDis = min(dis[y].EvenDis, dis[x].OddDis + z);
			if (dis[y].EvenDis ^ EvenDis || dis[y].OddDis ^ OddDis)
				Q.push(y);
		}
	}
}

signed main() {
	bool flag = false;
	for (int i = 1; i <= m; ++i) {
		int from = read();
		int to = read();
		addEdge(from, to, 1);
		addEdge(to, from, 1);
		if (from == true || to == true) flag = 1;
	}
	SPFA();
	for (int i = 1; i <= q; ++i) {
		int ID = read();
		int wanted = read();
		if (ID == 1 && !flag) {
			puts("No");
			continue;
		}
		if (dis[ID].OddDis == 0x7fffffff && dis[ID].EvenDis == 0x7fffffff) {
			puts("No");
			continue;
		}
		if (((wanted & 1) && dis[ID].OddDis <= wanted) || ((~wanted & 1) && dis[ID].EvenDis <= wanted)) puts("Yes");
		else puts("No");
	}
	#define _ 0
	return ~~(0^_^0);
}
```