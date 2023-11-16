---
date: '2020-08-02'
title: 'Solution -「CF 522D」Closest Equals'

---

## 题意简述

不带修区间 Closest Equals。

## 题解

~~就这能黑？~~

可谓是非常套路的一道题。

开始打了个回滚莫队打算交上去 T 了卡常。

结果 WA 了（雾。

先把询问离线，按照右端点排序。

然后考虑维护一个数组 `pre[x]` 表示数 $x$ 的上一个位置。

然后我们遍历每一个询问（有序），并整一个原序列的指针 `ptr`，从一开始。

然后我们设当前遍历到的询问是第 $i$ 个，把 `ptr` 从当前的位置一直移到询问的右端点。

`ptr` 的移动的过程中我们维护一个前缀信息，把当前的贡献 `ptr-pre[a[ptr]]` （即当前 `ptr` 指针指到的数的最近一个相等的数）加到 `pre[a[ptr]]` 里。

移动完成后，这个询问的答案就是这个询问的左右端点代表区间的区间最小值。

综上，我们需要一个支持单点加，区间查极值的数据结构，线段树即可。

做完这题后可以去做一下 CF703D。

```cpp
#include <cstdio>
#include <algorithm>
#include <queue>

using namespace std;

const int Maxn = 5e5 + 5;
int n, m, isa[Maxn], pre[Maxn], ans[Maxn], sgt[Maxn << 2];
vector < int > disc;
struct Queries
{
	int l, r, id;
	bool operator < (const Queries& rhs) const
	{
		return r < rhs.r;
	}
} Q[Maxn];

void ins(int p, int l, int r, int x, int v)
{
	if (l == r)
	{
		sgt[p] = v;
		return ;
	}
	int mid = (l + r) >> 1;
	if (mid >= x)	ins(p << 1, l, mid, x, v);
	else	ins(p << 1 | 1, mid + 1, r, x ,v);
	sgt[p] = min(sgt[p << 1], sgt[p << 1 | 1]);
}

int find(int p, int l, int r, int x, int y)
{
	if (l > y || r < x) 	return 2e9;
	if (l >= x && r <= y)	return sgt[p];
	int mid = (l + r) >> 1, ret = 2e9;
	if (mid >= x)	ret = min(ret, find(p << 1, l, mid, x, y));
	if (mid < y)	ret = min(ret, find(p << 1 | 1, mid + 1, r, x, y));
	return ret;
}

// 以上的部分不需要解释吧

signed main()
{
	scanf("%d %d", &n, &m);
	for (int i = 1; i <= n; ++i)
	{
		scanf("%d", &isa[i]);
		disc.push_back(isa[i]);
	}
	sort(disc.begin(), disc.end());
	disc.erase(unique(disc.begin(), disc.end()), disc.end());
	for (int i = 1; i <= n; ++i)	isa[i] = lower_bound(disc.begin(), disc.end(), isa[i]) - disc.begin() + 1;
	for (int i = 0; i < (Maxn << 2); ++i)	sgt[i] = 2e9; // 离散化 & 线段树赋初值（懒得建树）
	for (int i = 1; i <= m; ++i)
	{
		scanf("%d %d", &Q[i].l, &Q[i].r);
		Q[i].id = i;
	}
	sort(Q + 1, Q + 1 + m);
	int ptr = 1;
	for (int i = 1; i <= m; ++i)
	{
		while (ptr <= Q[i].r) // 移动 ptr 指针到询问右端点
		{
			if (pre[isa[ptr]])	ins(1, 1, n, pre[isa[ptr]], ptr - pre[isa[ptr]]); // 把当前这个数的贡献加到上一个出现这个数的位置
			pre[isa[ptr]] = ptr; // 顺手维护 pre 数组，顺带一提如果你要预处理 pre 数组的话定义会有区别
			++ptr;
		}
		ans[Q[i].id] = find(1, 1, n, Q[i].l, Q[i].r);
		if (ans[Q[i].id] == 2e9)	ans[Q[i].id] = -1;
	}
	for (int i = 1; i <= m; ++i)	printf("%d\n", ans[i]);
	return 0;
}
```