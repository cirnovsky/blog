---
date: 2020-09-19
title: Ds100p -「数据结构百题」41~50
category: notes
tags: [data-structures]
---

# 41.P3590 [POI2015]TRZ

给定一个长度为n的仅包含'B'、'C'、'S'三种字符的字符串，请找到最长的一段连续子串，使得这一段要么只有一种字符，要么有多种字符，但是没有任意两种字符出现次数相同。

-----------

## 题意简述

题意够简单了就不说了。

## 题解

暴力能过。

开三个数组前缀和一下每个字母出现的次数，然后枚举长度暴力check就过了。

暴力就这么点东西。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 1000000 + 5;
int n, b[N], c[N], s[N];
char str[N];

bool check(int p) {
    for (int i = 1; i <= n - p + 1; ++i) {
        int s1 = b[i + p - 1] - b[i - 1];
        int s2 = c[i + p - 1] - c[i - 1];
        int s3 = s[i + p - 1] - s[i - 1];
        if (s1 != s2 && s2 != s3 && s1 != s3) return true;
    }
    return false;
}

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);
    cin >> n >> str;
    for (int i = 0; i < n; ++i) {
        char ch = str[i];
        if (ch == 'B') b[i + 1] = 1;
        else if (ch == 'C') c[i + 1] = 1;
        else s[i + 1] = 1;
    }
    for (int i = 1; i <= n; ++i) {
        b[i] += b[i - 1];
        c[i] += c[i - 1];
        s[i] += s[i - 1];
    }
    for (int i = n; i >= 1; --i)
        if (check(i)) return printf("%d\n", i), 0;
    return puts("1"), 0;
}
```

# 42.P4688 [Ynoi2016]掉进兔子洞

您正在打 galgame，然后突然发现您今天太颓了，于是想写个数据结构题练练手：

一个长为 $n$ 的序列 $a$。

有 $m$ 个询问，每次询问三个区间，把三个区间中同时出现的数一个一个删掉，问最后三个区间剩下的数的个数和，询问独立。

注意这里删掉指的是一个一个删，不是把等于这个值的数直接删完，比如三个区间是  $[1,2,2,3,3,3,3]$，$[1,2,2,3,3,3,3]$ 与 $[1,1,2,3,3]$，就一起扔掉了 $1$ 个 $1$，$1$ 个 $2$，$2$ 个 $3$。

-----------

## 题意简述

Ynoi的题貌似题面都很简洁……（除了惯例的一大堆Gal或Anime的图片+对话以外）

## 题解

读完题，我们可以发现每轮询问的答案是这个东西:

$$
\sum_{i=1}^{3}(r_{i}-l_{i}+1)-P\times 3
$$

其中，$P$ 表示三个区间里面的公共颜色数量。

前面那个 $\sum$ 里面的东西很好维护，我们主要来讲后面一部分的维护方法。

首先初始序列的 $a_{i}$ 是一定要离散化一遍的。

那么我们如何表示出出现的最少次数呢？

如果这是一个二进制串的话，我们可以发现这就是一个 $\operatorname{bit\_and}$ 的操作。

对于每个询问，我们可以把三个区间分开处理再合并。直接维护复杂度过高，用 bitset 优化。由于这是个二进制序列，所以离散化的时候不能去重，否则答案就会偏大。

直接操作容易 MLE，这里介绍一个小trick。我们可以把询问分批处理，这样就行了。

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>
#include <bitset>
#include <cmath>

using namespace std;
typedef long long LL;
typedef unsigned long long ULL;

const int N = 1e5 + 5;
const int F = 23333 + 5;
int n, m, block, origin[N], appear[N];
int cnt[N], ans[N], vis[25005];
int l1[N], l2[N], l3[N];
int r1[N], r2[N], r3[N];
bitset < N > S[F];
vector < int > disc;
struct AskSet {
	int l, r;
	int id, p;
} Q[N];

int GetID(int x) {
	return lower_bound(disc.begin(), disc.end(), x) - disc.begin() + 1;
}

bool SortWith(const AskSet& x, const AskSet& y) {
	return (x.p < y.p) || (x.p == y.p && x.r < y.r);
}

void MakeCont(int pos, int flags, bitset < N >& bit) {
	pos = origin[pos];
	if (flags > 0) bit[pos + cnt[pos]] = 1;
	else bit[pos + cnt[pos] - 1] = 0;
	cnt[pos] += flags;
}

void Contribute(int fr, int ba) {
	memset(cnt, 0, sizeof cnt);
	memset(vis, 0, sizeof vis);
	bitset < N > bit; bit.reset();
	int l = 1, r = 0, subs = 0;
	for (int i = fr; i <= ba; ++i) {
		Q[++subs] = {l1[i], r1[i], i, appear[l1[i]]};
		Q[++subs] = {l2[i], r2[i], i, appear[l2[i]]};
		Q[++subs] = {l3[i], r3[i], i, appear[l3[i]]};
		ans[i] += (r3[i] - l3[i]) + (r2[i] - l2[i]) + (r1[i] - l1[i]) + 3;
	}
	sort(Q + 1, Q + 1 + subs, SortWith);
	for (int i = 1; i <= subs; ++i) {
		while (r < Q[i].r) MakeCont(++r, 1, bit);
		while (l > Q[i].l) MakeCont(--l, 1, bit);
		while (r > Q[i].r) MakeCont(r--, -1, bit);
		while (l < Q[i].l) MakeCont(l++, -1, bit);
		if (!vis[Q[i].id - fr + 1]) {
			vis[Q[i].id - fr + 1] = 1;
			S[Q[i].id - fr + 1] = bit;
		} else {
			S[Q[i].id - fr + 1] &= bit;
		}
	}
	for (int i = fr; i <= ba; ++i)
		ans[i] -= S[i - fr + 1].count() * 3;
}

signed main() {
	scanf("%d %d", &n, &m);
	block = sqrt(n);
	for (int i = 1; i <= n; ++i) {
		scanf("%d", &origin[i]);
		appear[i] = (i - 1) / block + 1;
		disc.push_back(origin[i]);
	}
	sort(disc.begin(), disc.end());
	for (int i = 1; i <= n; ++i)
		origin[i] = GetID(origin[i]);
	for (int i = 1; i <= m; ++i) {
		scanf("%d %d", &l1[i], &r1[i]);
		scanf("%d %d", &l2[i], &r2[i]);
		scanf("%d %d", &l3[i], &r3[i]);
	}
	for (int i = 1; i <= m; i += 23333) Contribute(i, min(m, i + 23332));
	for (int i = 1; i <= m; ++i) printf("%d\n", ans[i]);
	return 0;
}
```

# 43.P3224 [HNOI2012]永无乡

永无乡包含 $n$ 座岛，编号从 $1$ 到 $n$ ，每座岛都有自己的独一无二的重要度，按照重要度可以将这 $n$ 座岛排名，名次用 $1$  到 $n$ 来表示。某些岛之间由巨大的桥连接，通过桥可以从一个岛到达另一个岛。如果从岛 $a$ 出发经过若干座（含 $0$ 座）桥可以 到达岛 $b$ ，则称岛 $a$ 和岛 $b$ 是连通的。

现在有两种操作：

B x y 表示在岛 $x$ 与岛 $y$ 之间修建一座新桥。

Q x k 表示询问当前与岛 $x$ 连通的所有岛中第 $k$ 重要的是哪座岛，即所有与岛 $x$ 连通的岛中重要度排名第 $k$ 小的岛是哪座，请你输出那个岛的编号。

-------------

## 题意简述

现在有n个点和两种操作：

B x y 表示连接 x 与 y。

Q x k 表示询问 x 所在连通块里的第 k 小权值。

## 题解

首先一看到第k小，我们就想到用权值线段树或者平衡树来维护一个连通块里的值。

但是这道题要求连接两个连通块,单纯的权值线段树肯定不行。而一个节点一个节点暴力合并肯定会超时。

所以我们就打**线段树合并**罢！

线段树合并其实也挺暴力的。

它和真正的暴力合并只是如果要合并的两颗线段树中有一个没有当前要合并的节点，那么就直接把另一个线段树的节点接在这里。

~~其实就是一个剪枝对吧~~

这道题的权值个数只有n个，而且每个权值只有一个。

所以这个剪枝的作用很大。

那这道题的算法就是这样的：

用并查集维护连通块，用权值线段树维护值。

每次要合并两个连通块时，把 x 所在连通块和 y 所在连通块接在一起，然后合并这两个连通块的线段树。

查询就正常查询就好了。

代码：

```cpp
#include<cstdio>
int n,m,fa[300010],u,v,cnt,mpp[300010],opx,opy,root[300010],q;
char op;
struct node
{
	int l,r,num;
}nodes[30000010];
int finds(int x)//寻找 x 所在连通块编号。 
{
	if(fa[x]^x)	fa[x]=finds(fa[x]);
	return fa[x];
}
void ins(int l,int r,int &x,int pos)//初始时每个点都是一个连通块，提前处理它的线段树。 
{
	nodes[x=++cnt].num=1;
	if(l^r)
	{
		int mid=(l+r)>>1;
		if(pos<=mid)	ins(l,mid,nodes[x].l,pos);
		else	ins(mid+1,r,nodes[x].r,pos);
	}
}
int merge(int x,int y)
{
	if(!x||!y)	return x+y;//有一个没有或两个都没有， x+y 返回不是 0 的那个或者因为两个都没有而返回0。 
	else
	{
		nodes[x].num+=nodes[y].num;//合并本节点。 
		nodes[x].l=merge(nodes[x].l,nodes[y].l);//
		nodes[x].r=merge(nodes[x].r,nodes[y].r);//合并左右儿子。 
		return x;//前面的信息储存到的是 x 这个节点那就返回 x 。 
	}
}
int find(int l,int r,int x,int k)//权值线段树正常查询。 
{
	if(l^r)
	{
		int mid=(l+r)>>1;
		if(nodes[nodes[x].l].num>=k)	return find(l,mid,nodes[x].l,k);
		else	return find(mid+1,r,nodes[x].r,k-nodes[nodes[x].l].num);
	}
	else	return l;
}
int main()
{
	scanf("%d %d",&n,&m);
	for(int i=1;i<=n;++i)	fa[i]=i;
	for(int i=1;i<=n;++i)
	{
		scanf(" %d",&u);
		mpp[u]=i;//记录每个权值对应的节点编号，便于之后输出。 
		ins(1,n,root[i],u);
	}
	for(int i=1;i<=m;++i)
	{
		scanf(" %d %d",&u,&v);
		int U=finds(u);//这些初始边也相当于从没有边开始进行加边操作。 
		int V=finds(v);
		if(U^V)
		{
			fa[U]=V;
			root[V]=merge(root[U],root[V]);//把 U 接到 V 上面了就要把 U 的线段树合并到 V 的线段树上。 
		}
	}
	scanf(" %d",&q);
	for(int i=1;i<=q;++i)
	{
		scanf(" %c %d %d",&op,&opx,&opy);
		if(op=='Q')
		{
			int OPX=finds(opx);
			if(nodes[root[OPX]].num>=opy)	printf("%d\n",mpp[find(1,n,root[OPX],opy)]);//查询第 k 小的值，输出对应的节点编号。 
			else	printf("-1\n");//这个连通块没有那么多点，输出 -1 。 
		}
		else
		{
			int OPX=finds(opx);
			int OPY=finds(opy);
			if(OPX^OPY)
			{
				fa[OPX]=OPY;
				root[OPY]=merge(root[OPX],root[OPY]);
			}
		}
	}
	return 0;
}
```

# 44.P5795 [THUSC2015]异或运算

给定长度为 $n$ 的数列 $X={x_1,x_2,...,x_n}$ 和长度为 $m$ 的数列 $Y={y_1,y_2,...,y_m}$，令矩阵 $A$ 中第 $i$ 行第 $j$ 列的值 $A_{i,j}=x_i\ \operatorname{xor}\ y_j$，每次询问给定矩形区域 $i∈[u,d],j∈[l,r]$，找出第 $k$ 大的 $A_{i,j}$。

--------

## 题意简述

根据两个数列做一个矩阵，给定几组询问，求一个矩形区域里的k大值

## 题解

可以发现 $N$ 很小，所以我们可以暴力枚举每个 $X_{i}$，然后对每个 $Y_{i}$ 建一个可持久化Trie树，插入即可。

对于询问，直接按照持久化Trie的查询套路来即可。首先记录root，然后我们就可以在查询时根据 $K$ 的大小来递归。

具体来说，就是往当前节点的哪个儿子走能使xor的结果的为1，然后根据从cnt的值判断递归方向。

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>
#include <utility>

using namespace std;

const int N = 300000 + 5;
int n, m, q, tot, wrt[N][2], trie[N * 40][2], frie[N * 40], root[N], X[N], Y[N];

int ins(int prt, int val) {
	int now = ++tot, res = now;
	for (int i = 31; ~i; --i) {
		int bit = (val >> i) & 1;
		trie[now][bit ^ 1] = trie[prt][bit ^ 1];
		prt = trie[prt][bit];
		now = trie[now][bit] = ++tot;
		frie[now] = frie[prt] + 1;
	}
	return res;
}

int ret(int x1, int x2, int y1, int y2, int k) {
	k = (x2 - x1 + 1) * (y2 - y1 + 1) - k + 1;
	for (int i = x1; i <= x2; ++i) {
		wrt[i][0] = root[y1 - 1];
		wrt[i][1] = root[y2];
	}
	int res = 0, cnt = 0;
	for (int i = 31; ~i; --i) {
		for (int j = x1; j <= x2; ++j) {
			int bit = (X[j] >> i) & 1;
			int now0 = wrt[j][0], now1 = wrt[j][1];
			cnt += frie[trie[now1][bit]] - frie[trie[now0][bit]];
		}
		int flags;
		if (k > cnt) k -= cnt, flags = 1;
		else flags = 0;
		res <<= 1, res |= flags;
		for (int j = x1; j <= x2; ++j) {
			int bit = ((X[j] >> i) & 1) ^ flags;
			int &now0 = wrt[j][0], &now1 = wrt[j][1];
			now0 = trie[now0][bit];
			now1 = trie[now1][bit];
		}
		cnt = 0;
	}
	return res;
}

signed main() {
	scanf("%d %d", &n, &m);
	for (int i = 1; i <= n; ++i)	scanf("%d", &X[i]);
	for (int i = 1; i <= m; ++i) {
		scanf("%d", &Y[i]);
		root[i] = ins(root[i - 1], Y[i]);
	}
	scanf("%d", &q);
	for (int i = 0, x1, x2, y1, y2, k; i < q; ++i) {
		scanf("%d %d %d %d %d", &x1, &x2, &y1, &y2, &k);
		printf("%d\n", ret(x1, x2, y1, y2, k));
	}
	return 0;
}
```

# 45.P3674 小清新人渣的本愿

这个题是这样的：

给你一个序列 $a$，长度为 $n$，有 $m$ 次操作，每次询问一个区间是否可以选出两个数它们的差为 $x$，或者询问一个区间是否可以选出两个数它们的和为 $x$，或者询问一个区间是否可以选出两个数它们的乘积为 $x$ ，这三个操作分别为操作 $1,2,3$。

选出的这两个数可以是同一个位置的数。

![](https://cdn.luogu.com.cn/upload/pic/4629.png)

---------

## 题意简述

~~尽管题意已经够简洁了但是我还是要坚持我的题解风格~~

## 题解

dllxl难的的一个比较水的题。

我们初一看这道题目。没修改，不强制在线，基本上大思路就往莫队走了。

考虑一种暴力做法，对三个操作分别开桶算贡献，加法减法的计算方法比较简单，加法就是减法的逆运算，反着开就行了。乘法直接枚举约数，毕竟这道题的值域和数列长度及询问是一样的。

发现容易炸，又因为我们的桶是根据存在性开的，所以我们可以用bitset来优化。

记录两个bitset为classic和inverse。

如果为操作一的话就是：

$$
\operatorname{ANS_{Q_{i}->id}}=(\operatorname{classic\ bitand\ (classic\ shl\ Q_{i}->x)}).\operatorname{any()}
$$

操作二类似：

$$
\operatorname{ANS_{Q_{i}->id}}=(\operatorname{classic\ bitand\ (inverse\ shr\ (100000-Q_{i}->x))}).\operatorname{any()}
$$

操作三则直接枚举。

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <cmath>
#include <bitset>

using namespace std;

char buf[1 << 21], *p1 = buf, *p2 = buf;
#ifndef ONLINE_JUDGE
#define gc() getchar()
#else
#define gc() (p1 == p2 && (p2 = (p1 = buf) + fread(buf, 1, 1 << 21, stdin), p1 == p2) ? EOF : *p1++)
#endif
#define is() (ch >= '0' && ch <= '9')

template < typename Type >
void read(Type& a) {
	a = 0; char ch; bool f = 0;
	while (!(ch = gc(), is())) if (ch == '-') f = 1;
	while (is()) a = (a << 3) + (a << 1) + (ch ^ '0'), ch = gc();
	a = (f ? -a : a);
}

template < typename Type, typename... Args >
void read(Type& t, Args&... args) {
	read(t), read(args...);
}

const int N = 1e5 + 5, R = 100000;
struct Query_Node {
	int id, pos;
	int tp, l, r, x;
	bool operator < (const Query_Node& rhs) const {
		if (pos != rhs.pos)		return pos < rhs.pos;
		else	return r < rhs.r;
	}
} e[N];
int n, m, Size, a[N], cnt[N], ans[N];
bitset < N > classic, inverse;

void Add(int x) {
	++cnt[a[x]];
	if (cnt[a[x]] == 1) {
		classic[a[x]] = 1;
		inverse[R - a[x]] = 1;
	}
}

void Del(int x) {
	--cnt[a[x]];
	if (cnt[a[x]] == 0) {
		classic[a[x]] = 0;
		inverse[R - a[x]] = 0;
	}
}

void Contribute() {
	int l = 1, r = 0;
	for (int i = 1; i <= m; ++i) {
		while (l < e[i].l) Del(l++);
		while (l > e[i].l) Add(--l);
		while (r > e[i].r) Del(r--);
		while (r < e[i].r) Add(++r);
		if (e[i].tp == 1) {
			ans[e[i].id] = (classic & (classic << e[i].x)).any();
		} else if (e[i].tp == 2) {
			ans[e[i].id] = (classic & (inverse >> (R - e[i].x))).any();
		} else {
			for (int j = 1; j * j <= e[i].x; ++j) {
				if (e[i].x % j == 0 && classic[j] && classic[e[i].x / j])
					ans[e[i].id] = 1;
			}
		}
	}
}

signed main() {
	read(n, m), Size = sqrt(n);
	for (int i = 1; i <= n; ++i) 	read(a[i]);
	for (int i = 1; i <= m; ++i) {
		read(e[i].tp, e[i].l, e[i].r, e[i].x);
		e[i].id = i, e[i].pos = (e[i].l - 1) / Size + 1;
	}
	sort(e + 1, e + 1 + m);
	Contribute();
	for (int i = 1; i <= m; ++i) 	puts(ans[i] ? "hana" : "bi");
	return 0;
}
```

# 46.P3709 大爷的字符串题

给你一个字符串 $a$，每次询问一段区间的贡献。

贡献定义：

每次从这个区间中拿出一个字符 $x$ ，然后把 $x$ 从这个区间中删除，直到区间为空。你要维护一个集合 $S$。

- 如果 $S$ 为空，你 rp 减 $1$。 
- 如果 $S$ 中有一个元素不小于 $x$，则你 rp 减 $1$，清空 $S$。
- 之后将 $x$ 插入 $S$。

由于你是大爷，平时做过的题考试都会考到，所以每次询问你搞完这段区间的字符之后最多还有多少 rp？rp 初始为 $0$。

询问之间不互相影响~

---------

## 题意简述

~~出题人语文……唉……~~

大意：给定几个询问，问一个区间最少被几个严格上升的序列覆盖。

可以转化为区间众数的出现次数。

## 题解

题面就不吐槽了。

不带修，可离线，考虑莫队。

我们可以维护两个东西。

一个是 $CNT_{x}$ 表示 $x$ 出现的次数。

还有一个就是 $APPEAR_{x}$ 表示出现次数为 $x$ 的数的数量。

$APPEAR_{x}$ 的定义有点绕，好好读一下。

莫队加贡献的时候就 `appear[cnt[a[x]]]--,appear[++cnt[a[x]]]++` 即可。

意思就是出现次数为 `cnt[a[x]]` 的没了，减一个，后面的同理。

减贡献大体没什么区别，用一个全局变量 `flags` 记录答案的相反数。需要注意的是如果满足 `cnt[a[x]]==flags && appear[cnt[a[x]]]==1` 那么我们需要将 `flags-1`。后面的就和加贡献反着来即可。

局部代码：

```cpp
const int N = 2e5 + 5;
int n, m, flags, Size, a[N], cnt[N], appear[N], ans[N];
vector < int > disc;
struct Query_Node {
	int l, r, id, pos;
	bool operator < (const Query_Node& rhs) const {
		if (pos == rhs.pos)
			return r < rhs.r;
		else return pos < rhs.pos;
	}
} e[N];

int Get_ID(int x) {
	return lower_bound(disc.begin(), disc.end(), x) - disc.begin() + 1;
}

void Add(int x) {
	appear[cnt[x]]--;
	appear[++cnt[x]]++;
	flags = max(flags, cnt[x]);
}

void Del(int x) {
	if (cnt[x] == flags && appear[cnt[x]] == 1) --flags;
	appear[cnt[x]]--;
	appear[--cnt[x]]++;
}

void Contribute() {
	int l = 1, r = 0;
	for (int i = 1; i <= m; ++i) {
		while (l < e[i].l) Del(a[l++]);
		while (l > e[i].l) Add(a[--l]);
		while (r > e[i].r) Del(a[r--]);
		while (r < e[i].r) Add(a[++r]);
		ans[e[i].id] = -flags;
	}
}

signed main() {
	read(n, m), Size = sqrt(m);
	for (int i = 1; i <= n; ++i) {
		read(a[i]);
		disc.push_back(a[i]);
	}
	sort(disc.begin(), disc.end());
	disc.erase(unique(disc.begin(), disc.end()), disc.end());
	for (int i = 1; i <= n; ++i)	a[i] = Get_ID(a[i]);
	for (int i = 1; i <= m; ++i) {
		read(e[i].l, e[i].r);
		e[i].id = i;
		e[i].pos = (e[i].l - 1) / Size;
	}
	sort(e + 1, e + 1 + m);
	Contribute();
	for (int i = 1; i <= m; ++i)	printf("%d\n", ans[i]);
	return 0;
}
```

# 47.P3313 [SDOI2014]旅行

S国有N个城市，编号从1到N。城市间用N-1条双向道路连接，满足从一个城市出发可以到达其它所有城市。每个城市信仰不同的宗教，如飞天面条神教、隐形独角兽教、绝地教都是常见的信仰。

为了方便，我们用不同的正整数代表各种宗教，  S国的居民常常旅行。旅行时他们总会走最短路，并且为了避免麻烦，只在信仰和他们相同的城市留宿。当然旅程的终点也是信仰与他相同的城市。S国政府为每个城市标定了不同的旅行评级，旅行者们常会记下途中（包括起点和终点）留宿过的城市的评级总和或最大值。

在S国的历史上常会发生以下几种事件：

“CC x c“：城市x的居民全体改信了c教；

“CW x w“：城市x的评级调整为w;

“QS x y“：一位旅行者从城市x出发，到城市y，并记下了途中留宿过的城市的评级总和；

“QM x y“：一位旅行者从城市x出发，到城市y，并记下了途中留宿过的城市的评级最大值。

由于年代久远，旅行者记下的数字已经遗失了，但记录开始之前每座城市的信仰与评级，还有事件记录本身是完好的。请根据这些信息，还原旅行者记下的数字。    为了方便，我们认为事件之间的间隔足够长，以致在任意一次旅行中，所有城市的评级和信仰保持不变。

-------

## 题意简述

将树链剖分模板加了个限制。

## 题解

这道题如果考虑最暴力的做法就是树剖后对每一种宗教建立线段树统计。

实际上对每一种宗教建立线段树是没有必要的。

我们可以采取线段树动态开点的方法进行修改和查询，记录下每种宗教开点时的根节点。

对于操作一，我们可以直接将修改前的宗教改为0，这样就避免了删除操作。

其他的操作基本就是树剖的板子了，具体看代码吧。

还有一个坑点在于这道题如果用fread的话会WA完，和Dynamic Rankings一个尿性，具体原因我也不清楚。但是fread的话建议能不用就不用，容易出锅。

```cpp
const int Maxn = 1e5 + 5;
int n, m, t_tot, root[Maxn], lev[Maxn], fai[Maxn];
int s_tot, siz[Maxn], dfn[Maxn], rnk[Maxn], top[Maxn], dep[Maxn], son[Maxn], fa[Maxn];
struct Tree_Node {
	int ls, rs;
	int _sum, _max;
} nodes[Maxn << 5];
vector < int > Graph[Maxn];

void dfs1(int x) {
	siz[x] = 1;
	dep[x] = dep[fa[x]] + 1;
	for (unsigned i = 0; i < Graph[x].size(); ++i) {
		int y = Graph[x][i];
		if (y == fa[x])		continue;
		fa[y] = x;
		dfs1(y);
		if (siz[son[x]] < siz[y])	son[x] = y;
	}
}

void dfs2(int x, int t) {
	dfn[x] = ++s_tot;
	rnk[dfn[x]] = x;
	top[x] = t;
	if (son[x])		dfs2(son[x], t);
	for (unsigned i = 0; i < Graph[x].size(); ++i) {
		int y = Graph[x][i];
		if (y == fa[x] || y == son[x])		continue;
		dfs2(y, y);
	}
}

int newnode() {
	int res = ++t_tot;
	nodes[res].ls = nodes[res].rs = 0;
	nodes[res]._sum = nodes[res]._max = 0;
	return res;
}

void Update(int p) {
	nodes[p]._max = max(nodes[nodes[p].ls]._max, nodes[nodes[p].rs]._max);
	nodes[p]._sum = nodes[nodes[p].ls]._sum + nodes[nodes[p].rs]._sum;
}

void Modify(int& p, int l, int r, int x, int v) {
	if (p == 0)		p = newnode();
	if (l == r) {
		nodes[p]._max = v;
		nodes[p]._sum = v;
		return;
	}
	int mid = (l + r) >> 1;
	if (mid >= x) {
		if (nodes[p].ls == 0) 	nodes[p].ls = newnode();
		Modify(nodes[p].ls, l, mid, x, v);
	} else {
		if (nodes[p].rs == 0)	nodes[p].rs = newnode();
		Modify(nodes[p].rs, mid + 1, r, x, v);
	}
	Update(p);
}

int Query_Max(int p, int l, int r, int x, int y) {
	if (l > y || r < x || p == 0)	return 0;
	if (l >= x && r <= y)	return nodes[p]._max;
	int mid = (l + r) >> 1, res = 0;
	if (mid >= x) 	res = max(res, Query_Max(nodes[p].ls, l, mid, x, y));
	if (mid < y)	res = max(res, Query_Max(nodes[p].rs, mid + 1, r, x, y));
	return res;
}

int Query_Sum(int p, int l, int r, int x, int y) {
	if (l > y || r < x || p == 0)	return 0;
	if (l >= x && r <= y)	return nodes[p]._sum;
	int mid = (l + r) >> 1, res = 0;
	if (mid >= x) 	res += Query_Sum(nodes[p].ls, l, mid, x, y);
	if (mid < y)	res += Query_Sum(nodes[p].rs, mid + 1, r, x, y);
	return res;
}

int Query_Path_Max(int x, int y) {
	int res = 0, rt = root[fai[x]];
	while (top[x] != top[y]) {
		if (dep[top[x]] < dep[top[y]])	swap(x, y);
		res = max(res, Query_Max(rt, 1, n, dfn[top[x]], dfn[x]));
		x = fa[top[x]];
	}
	if (dep[x] > dep[y])	swap(x, y);
	return max(res, Query_Max(rt, 1, n, dfn[x], dfn[y]));
}

int Query_Path_Sum(int x, int y) {
	int res = 0, rt = root[fai[x]];
	while (top[x] != top[y]) {
		if (dep[top[x]] < dep[top[y]])	swap(x, y);
		res += Query_Sum(rt, 1, n, dfn[top[x]], dfn[x]);
		x = fa[top[x]];
	}
	if (dep[x] > dep[y]) 	swap(x, y);
	return res + Query_Sum(rt, 1, n, dfn[x], dfn[y]);
}

void Operation1(int x, int c) {
	Modify(root[fai[x]], 1, n, dfn[x], 0);
	fai[x] = c;
	Modify(root[c], 1, n, dfn[x], lev[x]);
}

void Operation2(int x, int w) {
	lev[x] = w;
	Modify(root[fai[x]], 1, n, dfn[x], lev[x]);
}

void Operation3(int x, int y) {
	printf("%d\n", Query_Path_Sum(x, y));
}

void Operation4(int x, int y) {
	printf("%d\n", Query_Path_Max(x, y));
}

signed main() {
	read(n, m);
	for (int i = 1; i <= n; ++i)	read(lev[i], fai[i]);
	for (int i = 1, x, y; i < n; ++i) {
		read(x, y);
		Graph[x].push_back(y);
		Graph[y].push_back(x);
	}
	dfs1(1), dfs2(1, 1);
	for (int i = 1; i <= n; ++i) 	Modify(root[fai[i]], 1, n, dfn[i], lev[i]);
	for (int i = 0; i < m; ++i) {
		char str[5];
		scanf("%s", str);
		if (str[1] == 'C') {
			int x, c;
			scanf("%d %d", &x, &c);
			Operation1(x, c);
		} else if (str[1] == 'W') {
			int x, w;
			scanf("%d %d", &x, &w);
			Operation2(x, w);
		} else if(str[1] == 'S') {
			int x, y;
			scanf("%d %d", &x, &y);
			Operation3(x, y);
		} else {
			int x, y;
			scanf("%d %d", &x, &y);
			Operation4(x, y);
		}
	}
	return 0;
}
```

# 48. P5309 [Ynoi2011]初始化

Mayuri 有 $n$ 颗星星，每颗星星都有一个明亮度 $A_{i}$ 。Mayuri 时常想知道一个区间 $[l,r]$ 内所有星星的明亮度的总和是多少。但是星星是会眨眼的，所以星星的明亮度是会变化的。有的时候，下标为 $y,y+x,y+2x,y+3x,\ldots,y+kx$ 的星星的明亮度会增加 $z$。保证 $y\leq x$。


Mayuri 不怎么会数学，请回答她的询问。答案要对 $10^{9}+7$ 取模。

--------

~~不愧是Ynoi，卡了好久的常数~~

我做的第一道Ynoi题！

好了我先概括下题目：

*操作$1$：将整个序列中下标$\%x$等于$y$的元素加上$z$。

*操作$2$：查询区间和。

*$2e5$个数，$2e5$个操作。

其实这道题的最大难点在于：$x$可能很小，修改的点很多且不是连续区间。

一个一个改肯定爆炸。

但是如果$x$很大，那么我们一个一个改没有问题。

所以我们可以对x进行分类。

设定一个阈值$lt$。

对于大于$lt$的$x$值，我们暴力修改。（反正个数少~）

对于小于$lt$的$x$值，我们可以用另一种方式来统计。

记录下所有$(x,y)$的操作$1$的$z$的和，用$sum[x][y]$表示。

我们在查询区间值的时候可以先查询暴力修改出来的值，然后统计这些小的修改的贡献。（先看这个区间有多少下标$%\x$等于$y$，然后乘上去再加就好了）

$lt$一般设为$\sqrt n$。（看情况吧）

**这就是根号分治了！**

根号分治：把一个问题的参数按$\sqrt n$分为两部分，分别设计算法实现。时间复杂度$O(n\sqrt n)$。

但是这样不太能解决这个问题。

因为如果查询一个区间暴力修改的和，我们需要一个数据结构进行查询，否则我们就退回了$O(n^2)$。

而这个数据结构的单点修改必须是$O(1)$的，否则$O(n\log_n\sqrt n)$也是无法通过此题的。

对了！分块！~~优秀数据结构果然名不虚传~~

我们用分块来维护暴力修改的区间和。

这个问题解决了，但还有另一个问题。

就是我们统计$sum[x][y]$的贡献的时候，会枚举$x,y$。

而$x,y$都是$\sqrt n$的。

那又回到$O(n^2)$了啊。

但我们稍加观察会发现：

对于每个$x$：$sum[x][y]$乘上的数只会有两个值，而且大的那个是小的那个$+1$。

比如下标序列$3$ $4$ $5$ $6$ $7$ $8$ $9$ $10$ $11$ $12$对于$x=4$

占位占位占位$3$ $0$ $1$ $2$ $3$ $0$ $1$ $\ \ 2$ $\ 3$ $\ \ 0$

其中$3$出现了$3$次，$2$出现了$2$次，$1$出现了$2$次，$0$出现了$3$次。

我们会发现这是有规律的，其中$3$次的和$2$次的都连成了一个区间。（$0$和$3$其实也是一个连续的区间）

所以我们可以用前缀和优化这个统计过程。

那么前面加上$(x,y)$操作的值的时候，就要把$y$以上的值也加上同样的值，以保持前缀和。单次操作变为$O(n\sqrt n)$。

统计时，先算出较小的那个次数是多少。
然后我们用整个$sum[x][x-1]$来乘上它。接着计算多的那个次数的区间。

那肯定是从$begin\%x$到$end\%x$了！

因为从$end\%x$再到下一个$begin\%x$都没有加上最后一个1。

但是这是有例外的，如果区间长度刚好被x整除，那么我们会多算一个$sum[x][x-1]$。

例外？就是拿来特判的嘛~

那么我们就只用枚举$x$了，时间复杂度最后为$O(n\sqrt n)$。

快乐卡常~$233.cpp$太长我就不放了

代码：
```
//使用的卡常：少用long long,减法优化模运算，读优输优。 
#include<cstdio>
#include<algorithm>
using namespace std;
const int cube=500,mod=1e9+7,cude=200;//这里我数列分块设的500个元素一个块，阈值设的是200。 
int n,m,belong[200010],op,opa,opb,opc,sum[610],a[200010],sumar[610][610];//sum是数列分块统计和，sumar[x][y]表示下标%x为y的元素加上的值的前缀和 
void read(int &hhh)
{
	int x=0;
	char c=getchar();
	while((c<'0')|(c>'9')&&c^'-')	c=getchar();
	if(c^'-')	x=c^'0';
	char d=getchar();
	while((d<='9')&(d>='0'))
	{
		x=(x<<1)+(x<<3)+(d^'0');
		d=getchar();
	}
	if(c^'-')	hhh=x;
	else	hhh=-x;
}
void readlong(long long &hhh)
{
	long long x=0;
	char c=getchar();
	while((c<'0')|(c>'9')&&c^'-')	c=getchar();
	if(c^'-')	x=c^'0';
	char d=getchar();
	while((d<='9')&(d>='0'))
	{
		x=(x<<1)+(x<<3)+(d^'0');
		d=getchar();
	}
	if(c^'-')	hhh=x;
	else	hhh=-x;
}
void writinglong(long long x)
{
	if(!x)	return;
	writinglong(x/10);
	putchar((x%10)+'0');
}
void writelong(long long x)
{
	if(x<0)
	{
		putchar('-');
		x=-x;
	}
	else if(!x)
	{
		putchar('0');
		putchar('\n');
		return;
	}
	writinglong(x);
	putchar('\n');
}
int main()
{
	read(n);
	read(m);
	for(int i=1;i<=n;++i)
	{
		read(a[i]);
		if(a[i]==mod)	a[i]=0;//因为后面是用减法优化的模运算，所以要先处理到mod范围之内 
		belong[i]=(i-1)/cube+1;
		sum[belong[i]]+=a[i];
		if(sum[belong[i]]>=mod)	sum[belong[i]]-=mod;
	}
	for(int i=1;i<=m;++i)
	{
		read(op);
		read(opa);
		read(opb);
		if(op==1)
		{
			read(opc);
			if(opc==mod||opc==0)	continue;//加上的值就等于mod或者0，加了跟没加一样，浪费时间 
			if(opa<=cude)
			{
				if(opb==opa)	opb=0;//题目描述中y==x和y==0是同样效果
				for(int j=opb;j<opa;++j)
				{
					sumar[opa][j]+=opc;//累加前缀和 
					if(sumar[opa][j]>=mod)	sumar[opa][j]-=mod;
				}
			}
			else
			{
				for(int j=opb;j<=n;j+=opa)//暴力修改
				{
					a[j]+=opc;
					if(a[j]>=mod)	a[j]-=mod;
					sum[belong[j]]+=opc;
					if(sum[belong[j]]>=mod)	sum[belong[j]]-=mod;
				}
			}
		}
		else
		{
			int ans=0;
			if(opb-opa+1<=2*cube)//
			{
				for(int j=opa;j<=opb;++j)
				{
					ans+=a[j];
					if(ans>=mod)	ans-=mod;
				}
			}
			else
			{
				int begin=(opa+cube-2)/cube+1;
				int end=opb/cube;
				for(int j=begin;j<=end;++j)
				{
					ans+=sum[j];
					if(ans>=mod)	ans-=mod;
				}
				for(int j=(begin-1)*cube;j>=opa;--j)
				{
					ans+=a[j];
					if(ans>=mod)	ans-=mod;
				}
				for(int j=end*cube+1;j<=opb;++j)
				{
					ans+=a[j];
					if(ans>=mod)	ans-=mod;
				}
			}//分块统计暴力加出来的和 
			long long exans=ans;//这边有乘法必须开long long了 
			for(int j=1;j<=cude;++j)//枚举x 
			{
				int modea=opa%j;
				int modeb=opb%j;
				long long less=(opb-opa+1)/j;//少的区间那个的次数 
				if(less*j==opb-opa+1)	exans+=(less*sumar[j][j-1]);//我的特判~
				else if(modea<=modeb)	exans+=(less*sumar[j][j-1]+sumar[j][modeb]-(modea?sumar[j][modea-1]:0));//该情况中区间连续，直接加 
				else	exans+=(less*sumar[j][j-1]+sumar[j][j-1]-sumar[j][modea-1]+sumar[j][modeb]);//区间被分为前后两个连续部分 
				exans%=mod;
			}
			writelong((exans+mod)%mod);//前面可能减出负数 
		}
	}
	return 0;
}
```

# 49.CF383C Propagating tree

Iahub likes trees very much. Recently he discovered an interesting tree named propagating tree. The tree consists of $ n $ nodes numbered from $ 1 $ to $ n $ , each node $ i $ having an initial value $ a_{i} $ . The root of the tree is node $ 1 $ .

This tree has a special property: when a value $ val $ is added to a value of node $ i $ , the value - $ val $ is added to values of all the children of node $ i $ . Note that when you add value - $ val $ to a child of node $ i $ , you also add -(- $ val $ ) to all children of the child of node $ i $ and so on. Look an example explanation to understand better how it works.

This tree supports two types of queries:

- &quot; $ 1 $ $ x $ $ val $ &quot; — $ val $ is added to the value of node $ x $ ;
- &quot; $ 2 $ $ x $ &quot; — print the current value of node $ x $ .

In order to help Iahub understand the tree better, you must answer $ m $ queries of the preceding type.

--------


## 题意简述

给你一颗树，让你支持两种操作，一种子树修改，按深度分正负。一种单点查询节点。

## 题解

首先考虑把整棵树的DFS序整出来。然后我们可以每次递归结束后再记录一个当前的DFS序的值。

即处理出一棵树的子树中的DFS序的最大值和最小值，由于一颗子树里的DFS序一定是连续的，所以我们把这棵树用DFS序拍平到了序列上。

考虑修改操作没有限制，就是直接更新子树，那么我们可以用线段树或者树状数组来实现区间更新。

由于这个修改操作有限制，要根据修改的节点的深度分类为加或者减。所以我们可以维护两颗线段树/树状数组，一颗加，一颗减。

查询的时候我们就可以直接先查询维护加的线段树/树状数组然后减。

线段树太长，由于查询是单点操作，我们可以把序列差分，用树状数组两次单点修改，查询就两次前缀和即可。

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>

using namespace std;

const int Maxn = 2e5 + 5;
int n, m, tot, val [ Maxn ], fwt [ 2 ][ Maxn * 2 + 5 ], dfn [ Maxn ], fywf [ Maxn ], Lp [ Maxn ], Rp [ Maxn ];
vector < int > Graph [ Maxn ];

void dfs ( int x, int fa, int k )
{
	Lp [ x ] = ++ tot;
	fywf [ x ] = k;
	for ( unsigned i = 0; i < Graph [ x ].size ( ); ++ i )
	{
		int y = Graph [ x ][ i ];
		if ( y == fa )	continue;
		dfs ( y, x, k ^ 1 );
	}
	Rp [ x ] = tot;
}

void Modify ( int x, int v, int p )
{
	for ( ; x <= n * 2; x += x & -x )
		fwt [ p ][ x ] += v;
}

int Query ( int x, int p )
{
	int res = 0;
	for ( ; x; x -= x & -x )
		res += fwt [ p ][ x ];
	return res;
}

signed main()
{
	scanf ( "%d %d", &n, &m );
	for ( int i = 1; i <= n; ++ i )	scanf ( "%d", &val [ i ] );
	for (int i = 1, x, y; i < n; ++ i) {
		scanf ( "%d %d", &x, &y );
		Graph [ x ].push_back ( y );
		Graph [ y ].push_back ( x );
	}
	dfs ( 1, 0, 0 );
	for ( int i = 0, t, x, v; i < m; ++ i )
	{
		scanf ( "%d %d", &t, &x );
		if ( t == 1 )
		{
			scanf ( "%d", &v );
			Modify ( Lp [ x ], v, fywf [ x ] );
			Modify ( Rp [ x ] + 1, -v, fywf [ x ] );
		}
		else
		{
			printf ( "%d\n", val [ x ] + Query ( Lp [ x ], fywf [ x ] ) - Query ( Lp [ x ], fywf [ x ] ^ 1 ) );
		}
	}
	return 0;
}
```

# 50.P5072 [Ynoi2015]盼君勿忘

珂朵莉给了你一个序列，每次查询一个区间 $[l,r]$ 中所有子序列分别去重后的和 $\bmod\ p$。

-------

# 题意简述

不看前面的废话就是题意简述。

# 题解

这是[数据结构一百题](https://www.luogu.com.cn/blog/161849/post-ji-lie-shuo-ju-jie-gou-yi-bai-ti)的第50题（一半了哦）的纪念题解。

无修改操作，基本确定大方向莫队。

考虑查询的问题，我们可以转化一下。即求区间内每个数出现的次数。

一个区间 $[l,r]$ 的子序列数量为：

$$\sum_{i=0}^{r-l+1}C^{i}_{r-l+1}=2^{r-l+1}$$

比如一个数在区间 $[l,r]$ 出现了 $k$ 次，那么一共有 $2^{r-l+1-k}$ 个子序列不包含这个数。这个很好理解，从组合数的意义可知。那么就有 $2^{r-l+1}-2^{r-l+1-k}$ 个子序列包含了这个数。

那么我们就可以用莫队维护**区间中出现了 $k$ 次的所有数的和**，然后乘上一个  $2^{r-l+1}-2^{r-l+1-k}$ 就是它的贡献了。

问题又来了：每次询问的模数是不确定的，我们需要每次都需要 $\Theta(n)$ 处理一遍2的幂。

有没有什么方法能把处理这个东西的复杂度降到 $\Theta(\sqrt{n})$ 或以下呢？

~~对此SyadouHayami表示我们可以打个高精。~~

方法是有的。

我们可以每次询问都处理出 $2^{1},2^{2},\cdots,2^{\sqrt{n}}$ ，以及 $2^{2\sqrt{n}},2^{3\sqrt{n}},\cdots,2^{n}$，都只需要 $\Theta(\sqrt{n})$。当然，都是在模 $p$ 的意义下的。我们分别记为`pow1`和`pow2`。

那么 $2^{x}\operatorname{mod}p=(pow1_{x\operatorname{mod}\sqrt{n}}\times pow2_{\lfloor x\div\sqrt{n}\rfloor})\operatorname{mod}p$。

于是就解决问题了。

我的代码遇到了一下两个玄学问题，贴出来给同样情况的人看看：

1. 链表部分的`prev`和`next`如果放在结构体里会T。

2. `pow1`,`pow2`,`sum`,`cnt`几个数组的定义如果放在最开头和`isa`以及`ans`两个数组一起会RE。

```cpp
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>

using namespace std;

const int Maxn = 1e5 + 10;
const int Size = 320;
int n, m, isa[ Maxn ], ans[ Maxn ];
struct Query_Node
{
	int l, r, p, id, pos;
} Q[ Maxn ];
struct Linked_List
{
	int tot, prev[ Maxn ], next[ Maxn ];
	Linked_List( ) { tot = 0; }

	void insert( int x )
	{
		next[ tot ] = x;
		prev[ x ] = tot;
		tot = x;
	}

	void erase( int x )
	{
		if( tot == x )	tot = prev[ x ];
		else
		{
			next[ prev[ x ] ] = next[ x ];
			prev[ next[ x ] ] = prev[ x ];
		}
		prev[ x ] = next[ x ] = 0;
	}
} llt;

bool cmp( Query_Node rhs, Query_Node shr )
{
	if( rhs.pos != shr.pos )	return rhs.l < shr.l;
	else	return rhs.r < shr.r;
}

int pow1[ Maxn ], pow2[ Maxn ];
void Pare_Two( int p )
{
	pow1[ 0 ] = pow2[ 0 ] = 1;
	for( int i = 1; i <= Size; ++ i ) 	pow1[ i ] = 1ll * 2 * pow1[ i - 1 ] % p;
	for( int i = 1; i <= Size; ++ i )	pow2[ i ] = 1ll * pow1[ Size ] * pow2[ i - 1 ] % p;
}

int Get_Two( int x, int p )
{
	return 1ll * pow1[ x % Size ] * pow2[ x / Size ] % p;
}

int sum[ Maxn ], cnt[ Maxn ];
void Make_Cont( int x, int f )
{
	int pos = isa[ x ];
	sum[ cnt[ pos ] ] -= pos;
	if ( ! sum[ cnt[ pos ] ] ) llt.erase( cnt[ pos ] );
	if( f == 1 ) ++cnt[ pos ];
	else --cnt[ pos ];
	if ( ! sum[ cnt[ pos ] ] ) llt.insert( cnt[ pos ] );
	sum[ cnt[ pos ] ] += pos;
}

void Contribute( )
{
	int l = 1, r = 0;
	for( int i = 1; i <= m; ++ i )
	{
		Pare_Two( Q[ i ].p );
		while( l > Q[ i ].l ) Make_Cont( --l, 1 );
		while( l < Q[ i ].l ) Make_Cont( l++, 0 );
		while( r > Q[ i ].r ) Make_Cont( r--, 0 );
		while( r < Q[ i ].r ) Make_Cont( ++r, 1 );
		for( int s = llt.next[ 0 ]; s; s = llt.next[ s ] )
		{
			int val = 1ll * sum[ s ] * ( Get_Two( r - l + 1, Q[ i ].p ) - Get_Two( r - l + 1 - s, Q[ i ].p ) + Q[ i ].p ) % Q[ i ].p;
			ans[ Q[ i ].id ] += val;
			ans[ Q[ i ].id ] %= Q[ i ].p;
		}
	}
}

signed main( )
{
	scanf( "%d %d", &n, &m );
	for( int i = 1; i <= n; ++ i )	scanf( "%d", &isa[ i ] );
	for( int i = 1; i <= m; ++ i )
	{
		int l, r, p;
		scanf( "%d %d %d", &l, &r, &p );
		Q[ i ].l = l, Q[ i ].r = r;
		Q[ i ].p = p, Q[ i ].id = i;
		Q[ i ].pos = l / Size;
	}
	sort( Q + 1, Q + 1 + m, cmp );
	Contribute( );
	for( int i = 1; i <= m; ++ i )
		printf( "%d\n", ans[ i ] );
	return 0;
}
```
    