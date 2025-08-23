---
date: 2020-09-19
title: Ds100p -「数据结构百题」61~70
category: notes
tags: [data-structures]
---

# 61.P5355 [Ynoi2017]由乃的玉米田

由乃在自己的农田边散步，她突然发现田里的一排玉米非常的不美。

这排玉米一共有 $N$ 株，它们的高度参差不齐。

由乃认为玉米田不美，所以她决定出个数据结构题
 
这个题是这样的：

给你一个序列 $a$，长度为 $n$，有 $m$ 次操作，每次询问一个区间是否可以选出两个数它们的差为 $x$，或者询问一个区间是否可以选出两个数它们的和为 $x$，或者询问一个区间是否可以选出两个数它们的乘积为 $x$ ，或者询问一个区间是否可以选出两个数它们的商为 $x$（没有余数） ，这四个操作分别为操作 $1,2,3,4$。

选出的这两个数可以是同一个位置的数。

----------------

## 题意简述

见题面

## 题解

前三个操作就是小清新人渣的本愿。

这里简单讲解一下。

记录两个 bitset `cla` 和 `inv`。

我们考虑莫队。

`cla[x]==1` 表示 $x$ 这个数出现过。

`inv[x]==1` 表示 $100000-x$ 这个数出现过。

这两个 bitset 的维护很简单，就是在莫队的加减贡献操作里改就行了。

对于第一个减法的判断，我们的答案就是 `((cla<<x)&cla)` 是否为 0。

如果为 0 的话表示应该输出有解。

正确性很好得到。

比如我们的询问是是否存在 $a,b$ 使得 $a-b=x$。

那么我们只需要存在 $a$ 以及 $a-x$ 即可。

第二个加法的判断也差不多，看作是加一个负数即可，判断是 `((cla<<(100000-x)&inv))`。

第三个乘法的判断直接暴力枚举因子 $i$，判断 $i,\frac{x}{i}$ 是否同时存在即可。($i\mid x$)。

由于值域和 $n,m$ 同阶，所以我们的复杂度是对的。

对于第四个操作我们直接从乘法贺过来。

枚举一个 $i$，从 1 开始，终止条件为 $i\times x\le100000$。

其中 $x$ 为当前询问给出的商。

然后直接判断是否同时存在 $i$ 和 $i\times x$ 即可。

在 $x\ge\sqrt{n}$ 的时候我们的复杂度是对的。

那么 $x<\sqrt{n}$ 的时候我们就换一种方法吧。

我们枚举一个 $x\in[1,\sqrt{100000}]$。

然后维护两个数组 `pre` 和 `mxp`。

在 $x$ 的枚举里面我们再枚举一个 $i\in[1,n]$。

然后 `pre[i]` 表示 $a_{i}$ 的上一次出现位置。

`mxp[i]` 扫描到 $i$ 的时候出现了满足 $a\div b=x$ 的最右位置。

维护的具体方法看注释吧。

这道题就完了。

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <bitset>
#include <queue>

using namespace std;

const int Maxn = 1e5 + 5, Maxs = 400 + 5, Maxv = 310;
int n, m, each, cube, isa[Maxn], cnt[Maxn], ans[Maxn], pre[Maxn], mxp[Maxn], bel[Maxn], lps[Maxs], rps[Maxs];
struct Query
{
	int t, l, r, x, id;
	Query() {}
	Query(int t1, int t2, int t3, int t4, int t5)
	{
		t = t1;
		l = t2;
		r = t3;
		x = t4;
		id = t5;
	}
};
struct Special
{
	int l, r, id;
	Special() {}
	Special(int t1, int t2, int t3)
	{
		l = t1;
		r = t2;
		id = t3;
	}
};
vector < Query > Mq; // Mo's Algorithm | Query
vector < Special > Vq[Maxn]; // Violence | Query
bitset < Maxn > cla, inv; // classic | inverse

bool cmp(const Query &one, const Query &ano)
{
	if (bel[one.l] != bel[ano.l])   return one.l < ano.l;
	else if (bel[one.l] & 1)    return one.r < ano.r;
	else    return one.r > ano.r;
}

void Plus_Cont(int x)
{
	x = isa[x];
	if (cnt[x] == 0)
	{
		cla[x] = 1;
		inv[100000 - x] = 1;
	}
	++cnt[x];
}

void Mins_Cont(int x)
{
	x = isa[x];
	--cnt[x];
	if (cnt[x] == 0)
	{
		cla[x] = 0;
		inv[100000 - x] = 0;
	}
}

void Pare_v1()
{
	int l = 1, r = 0;
	for (auto it : Mq)
	{
		while (l > it.l)	Plus_Cont(--l);
		while (l < it.l)	Mins_Cont(l++);
		while (r > it.r)	Mins_Cont(r--);
		while (r < it.r)	Plus_Cont(++r);
		if (it.t == 1)  ans[it.id] = ((cla << it.x) & cla).any();
		else if (it.t == 2)  ans[it.id] = ((cla << (100000 - it.x)) & inv).any();
		else if (it.t == 3)
		{
			bool flag = 0;
			for (int i = 1; i * i <= it.x; ++i)
			{
				if (it.x % i == 0 && cla.test(i) && cla.test(it.x / i))
				{
					ans[it.id] = 1;
					flag = 1;
					break;
				}
			}
			if (flag == 0)  ans[it.id] = 0;
		}
		else
		{
			bool flag = 0;
			for (int i = 1; i * it.x <= 100000; ++i)
			{
				if (cla.test(i) && cla.test(i * it.x))
				{
					ans[it.id] = 1;
					flag = 1;
					break;
				}
			}
			if (flag == 0)	ans[it.id] = 0;
		}
	}
}

void Pare_v2()
{
	for (int x = 1; x <= Maxv; ++x)
	{
		if (Vq[x].empty())	continue;
		int now = 0;
		for (int i = 1; i <= n; ++i)
		{
			int y = isa[i];
			pre[y] = i;
			if (x * y <= 100000)	now = max(now, pre[x * y]);
			if (y % x == 0) 	now = max(now, pre[y / x]);
			mxp[i] = now;
		}
		for (auto it : Vq[x])
		{
			if (it.l <= mxp[it.r])	ans[it.id] = 1;
			else	ans[it.id] = 0; 
		}
		memset(pre, 0, sizeof pre);
		memset(mxp, 0, sizeof mxp);
	}
}

char ANS[2][10] = { "yumi", "yuno" };
signed main()
{
	scanf("%d %d", &n, &m);
	each = 320;
	cube = (n - 1) / each + 1;
	for (int i = 1; i <= n; ++i)	scanf("%d", &isa[i]);
	for (int i = 1; i <= cube; ++i)
	{
		lps[i] = rps[i - 1] + 1;
		rps[i] = rps[i - 1] + each;
		if (i == cube) 	rps[i] = n;
		for (int j = lps[i]; j <= rps[i]; ++j)  bel[j] = i;
	}
	for (int i = 1, t, l, r, x; i <= m; ++i)
	{
		scanf("%d %d %d %d", &t, &l, &r, &x);
		if (t == 4 && x <= Maxv)    Vq[x].emplace_back(Special(l, r, i));
		else    Mq.emplace_back(Query(t, l, r, x, i));
	}
	sort(Mq.begin(), Mq.end(), cmp);
	Pare_v1(), Pare_v2();
	for (int i = 1; i <= m; ++i)    puts(ANS[ans[i]]);
	return 0;
}
```

# 62.P5354 [Ynoi2017]由乃的OJ

第一行两个整数 $n,m$。

第二行 $n$ 个整数表示序列 $a$。

接下来 $m$ 行，每行四个整数：

- `1 l r x`：把区间 $[l,r]$ 所有大于 $x$ 的数减去 $x$。
- `2 l r x`：查询区间 $[l,r]$ 内的 $x$ 的出现次数。

---------------

题目里讲得非常清楚，就是把 睡觉困难综合征 搬到树上了。

那我们先回想一下 睡觉困难综合征 是怎么做的：

首先我们设了两个值，一个在二进制下全是 $1$ （下文中为 $mx$ ），一个全是 $0$ （下文中为 $mn$ ）。

然后我们直接对序列中每一个操作用这两个值进行模拟。

因为二进制运算每个位独立，所以我们可以得到一开始的时候每个位选  $0$ 或 $1$ 时最后能够得到 $0$ 还是 $1$ 。

然后我们就贪心进行选取 $0/1$ 就好了。

先考虑一个序列如何动态维护这个问题。

我们可以开一棵线段树，维护区间内一开始是 $mx$ 和 $mn$ ，一直把这个区间模拟完之后的结果。

那么问题来了，如何合并两个区间的答案呢？

我们先按位分析：现在知道这位选 $1$ 和 $0$ 分别在两边会得到什么结果，那我们先模拟这位选什么，用在左边的结果再拿到右边去看放进去会得到什么结果。这样就可以得到整个区间这位选 $1$ 或 $0$ 的结果了。

那么我们一共枚举最多 $64$ 位， $64$ 的常数瞬间爆炸，所以肯定不能按位枚举。

想一想如果优化这个过程。

我们可以先得到左边全选 $1$ 或 $0$ 时会得到的结果上哪些位是 $1$ ，哪些位是 $0$ 。然后去右边区间看下这些是 $1$ 的位上哪些又会变成  $0$ 或 $1$ ，是 $0$ 的位上哪些又是 $1$ 或 $0$ 。

首先设 $tmp1$ 表示经过左边之后是 $1$ 的位置， $tmp0$ 表示经过左边之后是 $0$ 的位置。

那么 `tmp1=now,tmp0=now;`（ $now$ 表示当前左边全选 $0$ 或 $1$ 的结果）

然后得到答案 `ans=(tmp1&right1)|(tmp0&right0)`。（ $right0/1$ 表示右边全选 $0/1$ 的结果）

就相当于把左边结果的 $0$ 和 $1$ 分别处理，把是$0$或$1$的位上的右边的结果直接搬过来。

因为这一位经过左边后变成了 $0/1$，所以这一位经过右边之后就应该是右边一开始这位选 $0/1$ 的结果。

这样我们就做到了 $\operatorname{O}(1)$ 合并两个区间的结果。

最后再用树链剖分把这个过程搬到树上就好了。

这道题的两个端点的顺序是有影响的。所以要在树剖里分类讨论，还要维护区间倒着来的结果。

~~细节很多WA了很久，不愧是Ynoi~~

代码：
```
#include<cstdio>
#include<vector>
using namespace std;
vector<unsigned long long> e[100010];
struct node
{
	unsigned long long one,zero;
}nodes[400010],exnodes[400010],emp,ret,exret;//nodes是正着来，exnodes是反着来 
const unsigned long long cone=1;//1常量，免得1<<i爆掉 
unsigned long long mx,mn;//全为1和全为0的量 
unsigned long long n,m,k,opx[100010],op[100010],u,v,opt,opa,opb,opc;
unsigned long long siz[100010],son[100010],dep[100010],fa[100010],hb[100010],dfn[100010],ton[100010],cnt;
bool flag,exflag;
void dfs1(unsigned long long x,unsigned long long las)
{
	fa[x]=las;
	dep[x]=dep[las]+cone;
	siz[x]=cone;
	for(unsigned long long i=0;i<e[x].size();++i)
	{
		unsigned long long y=e[x][i];
		if(y^las)
		{
			dfs1(y,x);
			siz[x]+=siz[y];
			if(siz[son[x]]<siz[y])	son[x]=y;
		}
	}
}
void dfs2(unsigned long long x,unsigned long long las,bool heavy)
{
	dfn[x]=++cnt;
	ton[cnt]=x;
	if(heavy)	hb[x]=hb[las];
	else	hb[x]=x;
	if(son[x])	dfs2(son[x],x,1);
	for(unsigned long long i=0;i<e[x].size();++i)
	{
		unsigned long long y=e[x][i];
		if((y^las)&&(y^son[x]))	dfs2(y,x,0);
	}
}
node merge(node one,node ano)
{
	node res=emp;
	unsigned long long tmp1=one.one;
	unsigned long long tmp0=~tmp1;
	res.one=(tmp1&ano.one)|(tmp0&ano.zero);
	tmp1=one.zero;
	tmp0=~tmp1;
	res.zero=(tmp1&ano.one)|(tmp0&ano.zero);//全选0/1分别维护 
	return res;
}
void build(unsigned long long l,unsigned long long r,unsigned long long x)
{
	if(l^r)
	{
		unsigned long long mid=(l+r)>>cone;
		build(l,mid,x<<cone);
		build(mid+cone,r,x<<cone|cone);
		nodes[x]=merge(nodes[x<<cone],nodes[x<<cone|cone]);
		exnodes[x]=merge(exnodes[x<<cone|cone],exnodes[x<<cone]);//反着来的肯定也要反着合并 
	}
	else
	{
		nodes[x]=exnodes[x]=emp;
		if(op[ton[l]]==cone)//初值直接模拟就好 
		{
			nodes[x].one&=opx[ton[l]];
			exnodes[x].one&=opx[ton[l]];
			nodes[x].zero&=opx[ton[l]];
			exnodes[x].zero&=opx[ton[l]];
		}
		else if(op[ton[l]]==2)
		{
			nodes[x].one|=opx[ton[l]];
			exnodes[x].one|=opx[ton[l]];
			nodes[x].zero|=opx[ton[l]];
			exnodes[x].zero|=opx[ton[l]];
		}
		else
		{
			nodes[x].one^=opx[ton[l]];
			exnodes[x].one^=opx[ton[l]];
			nodes[x].zero^=opx[ton[l]];
			exnodes[x].zero^=opx[ton[l]];
		}
	}
}
void update(unsigned long long l,unsigned long long r,unsigned long long x,unsigned long long pos,unsigned long long oper,unsigned long long val)
{
	if(l^r)
	{
		unsigned long long mid=(l+r)>>cone;
		if(pos<=mid)	update(l,mid,x<<cone,pos,oper,val);
		else	update(mid+cone,r,x<<cone|cone,pos,oper,val);
		nodes[x]=merge(nodes[x<<cone],nodes[x<<cone|cone]);
		exnodes[x]=merge(exnodes[x<<cone|cone],exnodes[x<<cone]);
	}
	else
	{
		op[ton[l]]=oper;
		opx[ton[l]]=val;
		nodes[x]=exnodes[x]=emp;
		if(op[ton[l]]==cone)
		{
			nodes[x].one&=opx[ton[l]];
			exnodes[x].one&=opx[ton[l]];
			nodes[x].zero&=opx[ton[l]];
			exnodes[x].zero&=opx[ton[l]];
		}
		else if(op[ton[l]]==2)
		{
			nodes[x].one|=opx[ton[l]];
			exnodes[x].one|=opx[ton[l]];
			nodes[x].zero|=opx[ton[l]];
			exnodes[x].zero|=opx[ton[l]];
		}
		else
		{
			nodes[x].one^=opx[ton[l]];
			exnodes[x].one^=opx[ton[l]];
			nodes[x].zero^=opx[ton[l]];
			exnodes[x].zero^=opx[ton[l]];
		}
	}
}
void find(unsigned long long l,unsigned long long r,unsigned long long x,unsigned long long fr,unsigned long long ba)//y用的find 
{
	if(l>ba||r<fr)	return;
	if(l>=fr&&r<=ba)
	{
		if(!flag)
		{
			ret=nodes[x];
			flag=cone;
		}
		else	ret=merge(nodes[x],ret);//LCA到y中是dfs序从小到大，y的dfs序大，所以要放到后面，并和正序的结果合并
	}
	else
	{
		unsigned long long mid=(l+r)>>cone;
		find(mid+cone,r,x<<cone|cone,fr,ba);//y放到后面 
		find(l,mid,x<<cone,fr,ba);
	}
}
void exfind(unsigned long long l,unsigned long long r,unsigned long long x,unsigned long long fr,unsigned long long ba)//x用的exfind 
{
	if(l>ba||r<fr)	return;
	if(l>=fr&&r<=ba)
	{
		if(!exflag)
		{
			exret=exnodes[x];
			exflag=cone;
		}
		else	exret=merge(exret,exnodes[x]);//x到LCA中是dfs序从大到小，x的dfs序大，所以要放到后面，并和倒序的结果合并
	}
	else
	{
		unsigned long long mid=(l+r)>>cone;
		exfind(mid+cone,r,x<<cone|cone,fr,ba);//x放到后面 
		exfind(l,mid,x<<cone,fr,ba);
	}
}
node LCA(unsigned long long x,unsigned long long y)
{
	unsigned long long fx=hb[x],fy=hb[y];
	flag=exflag=0;//如果之前没有值，就直接把值赋给ret/exret 
	ret=exret=emp;
	while(fx^fy)
	{
		if(dep[fx]>dep[fy])//分类讨论 
		{
			exfind(cone,n,cone,dfn[fx],dfn[x]);//x这边是从x到LCA往上，但x的dfs序更大 
			x=fa[fx];
			fx=hb[x];
		}
		else
		{
			find(cone,n,cone,dfn[fy],dfn[y]);//y这边是从LCA到y往下，但y的dfs序更大
			y=fa[fy];
			fy=hb[y];
		}
	}
	if(dep[x]<dep[y])	find(cone,n,cone,dfn[x],dfn[y]);
	else	exfind(cone,n,cone,dfn[y],dfn[x]);
	return merge(exret,ret);//x这边在前面 
}
unsigned long long solve(node how,unsigned long long lim)//贪心选取 
{
	unsigned long long res=0,used=0;
	for(unsigned long long i=k-1;i>=0;--i)
	{
		if(how.zero&(cone<<i))	res+=(cone<<i);
		else if((how.one&(cone<<i))&&used+(cone<<i)<=lim)
		{
			res+=(cone<<i);
			used+=(cone<<i);
		}
		if(i==0)	break;
	}
	return res;
}
int main()
{
	scanf("%llu %llu %llu",&n,&m,&k);
	mx=-cone;
	mn=0;
	emp.one=mx;
	emp.zero=mn;
	for(unsigned long long i=cone;i<=n;++i)	scanf("%llu %llu",&op[i],&opx[i]);
	for(unsigned long long i=cone;i<n;++i)
	{
		scanf("%llu %llu",&u,&v);
		e[u].push_back(v);
		e[v].push_back(u);
	} 
	dfs1(cone,cone);
	dfs2(cone,cone,0);
	build(cone,n,cone);
	for(unsigned long long i=cone;i<=m;++i)
	{
		scanf("%llu %llu %llu %llu",&opt,&opa,&opb,&opc);
		if(opt==2)	update(cone,n,cone,dfn[opa],opb,opc);
		else	printf("%llu\n",k?solve(LCA(opa,opb),opc):0);
	}
	return 0;
}
```

# 63.P5048 [Ynoi2019模拟赛]Yuno loves sqrt technology III

![](uploads/25.webp)

给你一个长为 $n$ 的序列 $a$，$m$ 次询问，每次查询一个区间的众数的出现次数，强制在线。

----------

## 题意简述

区间众数出现次数强制在线。

## 题解

三个 YLST 中比较清新的一个分块。

比较重点的地方在于询问散块的处理。

先离散化一下序列。

我们首先预处理出来一个 vector 数组 `fur[i]`，`fur[i]` 里面依次存的是所有 `isa[i]`（即这个序列，详见代码）的出现位置，再预处理一个 `pos[i]` 表示在当前第 $i$ 位时 `fur[i]` 的大小也就是一共出现了多少个 `isa[i]`。由于 vector 的下标是从 $0$ 开始的，所以所有的 `pos[i]` 都需要减个一。

然后询问处理整块的时候，我们先假设当前询问的区间是 `[opl,opr]`，然后把当前询问的答案 `res` 先置为 `App[bel[opl] + 1][bel[opr] - 1]`。

然后来考虑散块，在处理出的 vector 数组中判断即可。

设散块处理到数 `isa[i]`，那么如果存在 `pos[i] + res <= fur[isa[i]].size() - 1` 且 `fur[isa[i]][pos[i] + res] <= opr`，那么则说明这个数出现了至少 `res + 1` 次，将 `res` 加一即可。

由于 `res` 最多加不超过 $\Theta(2\sqrt{n})$ 次，所以复杂度是对的。

```cpp
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <queue>

using namespace std;

const int MAXN = 5e5 + 5, MAXM = 720 + 5;

char buf[1 << 21], *p1 = buf, *p2 = buf;
#define getchar( ) ( p1 == p2 && ( p2 = ( p1 = buf ) + fread( buf, 1, 1 << 21, stdin ), p1 == p2 ) ? EOF : *p1 ++ )

template<typename _T>
void read( _T &x ){
	x = 0; char c = getchar( ); _T f = 1;
	while( c < '0' || c > '9' ){ if( c == '-' )	f = -1; c = getchar( ); }
	while( c >= '0' && c <= '9' ){ x = ( x << 3 ) + ( x << 1 ) + ( c & 15 ); c = getchar( ); }
	x *= f;
}

template<typename _T>
void write( _T x ){
	if( x < 0 ){ putchar( '-' ); x = -x; }
	if( x > 9 ){ write( x / 10 ); }
	putchar( x % 10 + '0' );
}

template<typename _T>
void swapp( _T &one, _T &another ){ int temp = one; one = another; another = temp; }

template<typename _T>
_T MIN( _T one, _T another ){ return one > another ? another : one; }

template<typename _T>
_T MAX( _T one, _T another ){ return one > another ? one : another; }

int N, M;
int cube, each, kase, isa[MAXN], cnt[MAXN], pos[MAXN], vis[MAXN], bel[MAXN];
int lps[MAXM], rps[MAXM], app[MAXM], App[MAXM][MAXM];
vector<int> disc, fur[MAXN];

int getID( int x ){ return lower_bound( disc.begin( ), disc.end( ), x ) - disc.begin( ) + 1; }

void build( ){
	for( int i = 1; i <= cube; ++ i ){
		kase ++;
		for( int j = lps[i]; j <= rps[i]; ++ j ){
			if( vis[isa[j]] != kase )	cnt[isa[j]] = 0;
			cnt[isa[j]] ++; app[i] = MAX( app[i], cnt[isa[j]] );
			vis[isa[j]] = kase;
		}
	}
	memset( cnt, 0, sizeof( cnt ) );
	for( int i = 1; i <= cube; ++ i ){
		kase ++;
		for( int j = i; j <= cube; ++ j ){
			App[i][j] = App[i][j - 1];
			for( int k = lps[j]; k <= rps[j]; ++ k ){
				if( vis[isa[k]] != kase )	cnt[isa[k]] = 0;
				cnt[isa[k]] ++; App[i][j] = MAX( App[i][j], cnt[isa[k]] );
				vis[isa[k]] = kase;
			}
		}
	}
	memset( cnt, 0, sizeof( cnt ) );
}

int query( int opl, int opr ){
	if( bel[opl] == bel[opr] ){
		int res = 0; kase ++;
		for( int i = opl; i <= opr; ++ i ){
			if( vis[isa[i]] != kase )	cnt[isa[i]] = 0;
			cnt[isa[i]] ++; res = MAX( res, cnt[isa[i]] );
			vis[isa[i]] = kase;
		}
		return res;
	}
	int res = 0;
//	res = App[bel[opl] + 1][bel[opr] - 1];
	for( int i = bel[opl] + 1; i < bel[opr]; ++ i )	res += app[i];
//	for( int i = bel[opl] + 1; i < bel[opr]; ++ i )	res += App[i][i];
	for( int i = opl; i <= rps[bel[opl]]; ++ i ){
		int lim = fur[isa[i]].size( ) - 1;
		while( pos[i] + res <= lim && fur[isa[i]][pos[i] + res] <= opr )	res ++;
	}
	for( int i = lps[bel[opr]]; i <= opr; ++ i ){
		while( pos[i] - res >= 0 && fur[isa[i]][pos[i] - res] >= opl )	res ++;
	}
	return res;
}

signed main( ){
	read( N ); read( M ); each = 720; cube = ( N - 1 ) / each + 1;
	for( int i = 1; i <= N; ++ i ){ read( isa[i] ); disc.push_back( isa[i] ); }
	sort( disc.begin( ), disc.end( ) );
	disc.erase( unique( disc.begin( ), disc.end( ) ), disc.end( ) );
	for( int i = 1; i <= N; ++ i ){
		isa[i] = getID( isa[i] );
		fur[isa[i]].push_back( i );
		pos[i] = fur[isa[i]].size( ) - 1;
	}
	for( int i = 1; i <= cube; ++ i ){
		lps[i] = rps[i - 1] + 1; rps[i] = rps[i - 1] + each;
		if( i == cube )	rps[i] = N;
		for( int j = lps[i]; j <= rps[i]; ++ j )	bel[j] = i;
	}
	build( );
	int Ans = 0, opl, opr;
	while( M -- > 0 ){
		read( opl ); read( opr ); opl ^= Ans; opr ^= Ans;
		Ans = 0; if( opl > opr )	swapp( opl, opr );
		write( Ans = query( opl, opr ) ); putchar( '\n' );
	}
	return 0;
}
```

# 64.「LibreOJ β Round #4」框架

###### 没想到吧，我他娘的更新了

看到这道题

WGY说：bitset优化轻松过掉

LJS说：bitset优化裸题

ljs说：~~暴力打表能过！~~

那么这里是数据结构一百题，怎么能用这些方法呢？

所以我们来看看这道题吧：

有一个 $n\times m$的矩形框架，但其中有些边被删除了。$\operatorname{qmqmqm}$ 想知道剩余部分中还有多少完整的正方形。

$2\leq n,m\leq 10^3$

先不看数据范围

考虑最朴素的暴力

三重循环分别枚举：左上角横坐标，左上角纵坐标，正方形边长

时间复杂度$n^3$

妥妥超时

那我们怎么优化呢

开一个数组记录一个点往左和往上最多能往上走几条边，由于是正方形，取这两个值中较小的一个就行了。

那么我们可以知道以每个点为右下角时正方形的边长最大值。

只需要再判断左上角是否能够走那么长了。

我们发现，以一个点为正方形的右下角时，可能的左上角位置在一条直线上，那么我们可以直接处理这一条直线。

每个点有往左上可以走到的最大距离，我们可以求出每个点往右下走的最大距离。如果两个点可以互相到达，那么它们就可以作为一个正方形的两个顶点。

我们可以用主席树解决上面的问题：版本 $i$ 记录第 $1$ 到 $i$ 的点往前最多可以到达哪个点。

我们只在最远点上加个 $1$。因为之后查询会考虑到的。

再枚举每个点，查询从它后面到它往后最多能跳到的点中有多少点能够跳到它。

也就是这个区间的点中有多少个点能跳到的最远点小于等于它。

为什么有小于？因为如果能跳到更前面，那肯定能跳到这里。这就是之前只在最远点上加 $1$ 的原因。（其实区间加单点查也是可以的）

对于前面记录最多能跳到哪里的数组，我们用二分来获取它。

总时间复杂度：

二分：$n^2logn$（每个点一次二分）

主席树:$n^2logn$（主席树对每个点操作一次）

总：$n^2logn$（因为二分和主席树是两个分开的部分）

跑不过 $bitset$ 嘤嘤嘤...

代码：（注意细节）

```
#include<cstdio>
#include<algorithm>
using namespace std;
int n,m,lsum[1010][1010],hsum[1010][1010],dp[1010][1010],root[1010],ans,tot;
struct node
{
	int l,r,num;
}nodes[100010];
int search(int l,int r,int x,int y)
{
	while(l+1<r)
	{
		int mid=(l+r)>>1;
		if(lsum[x][y]-lsum[x-mid][y]==mid&&hsum[x][y]-hsum[x][y-mid]==mid)	l=mid;
		else	r=mid;
	}
	return l;
}
int exsearch(int l,int r,int x,int y)
{
	while(l+1<r)
	{
		int mid=(l+r)>>1;
		if(lsum[x+mid][y]-lsum[x][y]==mid&&hsum[x][y+mid]-hsum[x][y]==mid)	l=mid;
		else	r=mid;
	}
	return l;
}
void ins(int l,int r,int pre,int &now,int pos)
{
	now=++tot;
	nodes[now]=nodes[pre];
	++nodes[now].num;
	if(l^r)
	{
		int mid=(l+r)>>1;
		if(pos<=mid)	ins(l,mid,nodes[pre].l,nodes[now].l,pos);
		else	ins(mid+1,r,nodes[pre].r,nodes[now].r,pos);
	}
}
int find(int l,int r,int v1,int v2,int fr,int ba)
{
	if(l>ba||r<fr)	return 0;
	if(l>=fr&&r<=ba)	return nodes[v2].num-nodes[v1].num;
	int mid=(l+r)>>1;
	return find(l,mid,nodes[v1].l,nodes[v2].l,fr,ba)+find(mid+1,r,nodes[v1].r,nodes[v2].r,fr,ba);
}
void solve(int x,int y)
{
	tot=0;
	int siz=min(n-x,m-y)+1;
	for(int i=x,j=y,k=1;i<=n&&j<=m;++i,++j,++k)	ins(1,siz,root[k-1],root[k],k-dp[i][j]);
	for(int i=x,j=y,k=1;i<=n&&j<=m;++i,++j,++k)	ans+=find(1,siz,root[k],root[k+exsearch(0,min(n-i,m-j)+1,i,j)],1,k);
}
int main()
{
	scanf("%d %d",&n,&m);
	for(int i=1;i<=n;++i)
	{
		for(int j=2;j<=m;++j)
		{
			scanf("%d",&hsum[i][j]);
			hsum[i][j]+=hsum[i][j-1];
		}
	}
	for(int i=2;i<=n;++i)
	{
		for(int j=1;j<=m;++j)
		{
			scanf("%d",&lsum[i][j]);
			lsum[i][j]+=lsum[i-1][j];
		}
	}
	for(int i=1;i<=n;++i)
	{
		for(int j=1;j<=m;++j)
		{
			dp[i][j]=search(0,min(i,j),i,j);
		}
	}
	for(int i=1;i<=m;++i)	solve(1,i);
	for(int i=2;i<=n;++i)	solve(i,1);
	printf("%d",ans);
	return 0;
}
```

# 65. P4689 [Ynoi2016]这是我自己的发明

我首先认为这是 [SNOI2017 一个简单的询问](https://www.luogu.com.cn/problem/P5268) 搬到树上。

我们传统地把此题分为两个 $\texttt{pass}$，一个询问，一个修改。

- $\texttt{pass 1}$：询问

我直接按 *一个简单的询问* 的方法讲。~~其实是把以前的题解 copy 过来了~~。

由于是出现次数，满足区间加减性，所以我们可以这样表达 $\mathrm{get}(l,r,x)$（省略 $x$）:

$$
\mathrm{get}(l,r)=\mathrm{get}(1,r)-\mathrm{get}(1,l-1)
$$

那么我们代进原式，化一波式子（$\mathrm{get}(p)=\mathrm{get}(1,p,x)$）：

$$
\sum_{i=1}^{\infty}\mathrm{get}(l_{1},r_{1},x)\times\mathrm{get}(l_{2},r_{2},x)
$$

$$
\sum_{i=1}^{\infty}(\mathrm{get}(1,r_{1})-\mathrm{get}(1,l_{1}-1))\times(\mathrm{get}(1,r_{2})-\mathrm{get}(1,l_{2}-1))
$$

$$
\sum_{i=1}^{\infty}\mathrm{get}(r_{1})\times\mathrm{get}(r_{2})-\mathrm{get}(r_{1})\times\mathrm{get}(l_{2}-1)-\mathrm{get}(l_{1}-1)\times\mathrm{get}(r_{2})+\mathrm{get}(l_{1}-1))\times\mathrm{get}(l_{2}-1)
$$

$$
\mathrm{let}\ F(x,y)=\sum_{d}\mathrm{get}(1,l,d)\times\mathrm{get}(1,r,d)
$$

则答案为:

$$
F(r_{1},r_{2})-F(r_{1},l_{2}-1)-F(l_{1}-1,r_{2})+F(l_{1}-1,l_{2}-1)
$$

考虑怎么更新，比如从 $l$ 更新到 $l+1$，则：

$$
\mathrm{get(1,l)}\times\mathrm{get}(1,r)
$$

$$
\mathrm{get(1,l+1)}\times\mathrm{get}(1,r)
$$

$$
\mathrm{get(1,l)}\times\mathrm{get}(1,r)+\mathrm{cont}(a_{l})
$$

其中 $\mathrm{cont}(a_{l})$ 表示 $a_{l}$ 的出现次数。

则我们就知道怎么更新了，由于我们维护和的是前缀信息，所以姿势和普通莫队有点不一样。

维护两个数组 `cntl[x]` 和 `cntr[y]` 表示答案式子

$$
F(r_{1},r_{2})-F(r_{1},l_{2}-1)-F(l_{1}-1,r_{2})+F(l_{1}-1,l_{2}-1)
$$
子树的话直接 DFS 序拍到序列上。

- $\texttt{pass 2}$：修改

现在我们面临着查询操作我们是用莫队整的，但这个修改貌似不单纯。~~其实也是从树剖模板缝合过来的~~。

分类讨论，设我们当前要换的根为 $rt$，现在来处理询问，设查询的节点为 $u$，$\text{LCA}(u,v)$ 为节点 $u$ 和节点 $v$ 的最近公共祖先。

  - - 如果 $rt=u$，则我们直接对整棵树进行查询。
  - - 如果 $\text{LCA}(u,rt)\neq u$，此时修改不影响查询。
  - - 如果 $\text{LCA}(u,rt)=u$，此时 $rt$ 在 $u$ 的子树里，那么需要查询的地方就很明确了，后面的步骤显然。

于是我们不需要实际的去处理这个修改，然后就可以直接莫队了。

（整体感觉是个 原题+假上树+树剖模板 的缝合题）

```cpp
/* Clearink */

#include <cstdio>
#include <algorithm>

using namespace std;
typedef long long LL;

const int MAXN = 5e5 + 5, MAXM = 1e6 + 5;

int rint () {
	int x = 0, f = 1; char c = getchar ();
	for ( ; c < '0' || c > '9'; c = getchar () )	f = c == '-' ? -1 : f;
	for ( ; c >= '0' && c <= '9'; c = getchar () )	x = ( x << 3 ) + ( x << 1 ) + ( c & 15 );
	return x * f;
}

template<class _T>
void wint ( _T x ) {
	if ( x < 0 )	putchar ( '-' ), x = ~ x + 1;
	if ( x > 9 )	wint ( x / 10 );
	putchar ( x % 10 ^ '0' );
}

template<class _T> void swapp ( _T& x, _T& y ) { _T w = x; x = y; y = w; }

struct GraphSet {
	int to, nx;
	GraphSet () : to ( 0 ), nx ( 0 ) {}
	GraphSet ( const int a, const int b ) : to ( a ), nx ( b ) {}
} asg[MAXN * 2];

struct Quest {
	int l, r, ID, x;
	Quest () : l ( 0 ), r ( 0 ), ID ( 0 ), x ( 0 ) {}
	Quest ( const int a, const int b, const int c, const int d ) : l ( a ), r ( b ), ID ( c ), x ( d ) {}
} asq[MAXM * 8], itls[MAXN];

LL cur = 0, ans[MAXM], buc1[MAXN], buc2[MAXN];
int rt, pos[MAXN], blo = 320, col[MAXN], freq;
int n, m, bgn[MAXN], cnt, sjc, segl[MAXN], segr[MAXN], kfa[MAXN][21], a[MAXN], dept[MAXN], pri[MAXN], len;

void addE ( const int u, const int v ) { asg[++ cnt] = GraphSet ( v, bgn[u] ), bgn[u] = cnt; }
bool existcmp ( const Quest& one, const Quest& ano ) { return pos[one.l] == pos[ano.l] ? one.r < ano.r : one.l < ano.l; }

void dfs ( const int u, const int lst ) {
	kfa[u][0] = lst, dept[u] = dept[lst] + 1;
	segl[u] = ++ sjc, col[sjc] = a[u];
	for ( int i = 1; i <= 20; ++ i )	kfa[u][i] = kfa[kfa[u][i - 1]][i - 1];
	for ( int i = bgn[u]; i; i = asg[i].nx ) {
		int v = asg[i].to;
		if ( v == lst )	continue;
		dfs ( v, u );
	}
	segr[u] = sjc;
}

int calcKAC ( int u, int k ) {
	for ( int i = 20; ~ i; -- i ) {
		if ( k >= ( 1 << i ) )	k -= ( 1 << i ), u = kfa[u][i];
	}
	return u;
}

int calcLCA ( int u, int v ) {
	if ( dept[u] < dept[v] )	swapp ( u, v );
	for ( int i = 20; ~ i; -- i ) {
		if ( dept[kfa[u][i]] >= dept[v] )	u = kfa[u][i];
	}
	if ( u == v )	return u;
	for ( int i = 20; ~ i; -- i ) {
		if ( kfa[u][i] != kfa[v][i] )	u = kfa[u][i], v = kfa[v][i];
	}
	return kfa[u][0];
}

void initial () {
	for ( int i = 1; i <= n; ++ i )	pos[i] = ( i - 1 ) / blo + 1;
	sort ( pri + 1, pri + 1 + n );
	len = unique ( pri + 1, pri + 1 + n ) - pri - 1;
	for ( int i = 1; i <= n; ++ i )	a[i] = lower_bound ( pri + 1, pri + 1 + len, a[i] ) - pri;
	dfs ( 1, 0 );
}

void splitASdrug ( const int u, int& ils ) {
	if ( u == rt )	itls[++ ils] = Quest ( 1, n, 0, 0 );
	else {
		int lca = calcLCA ( u, rt );
		if ( lca != u )	itls[++ ils] = Quest ( segl[u], segr[u], 0, 0 );
		else {
			int ar = calcKAC ( rt, dept[rt] - dept[u] - 1 );
			if ( 1 <= segl[ar] - 1 )	itls[++ ils] = Quest ( 1, segl[ar] - 1, 0, 0 );
			if ( segr[ar] + 1 <= n )	itls[++ ils] = Quest ( segr[ar] + 1, n, 0, 0 );
		}
	}
}

void transASsub ( const int l1, const int r1, const int l2, const int r2, const int ID ) {
	asq[++ m] = Quest ( r1, r2, ID, 1 ), asq[++ m] = Quest ( r1, l2 - 1, ID, -1 );
	asq[++ m] = Quest ( l1 - 1, r2, ID, -1 ), asq[++ m] = Quest ( l1 - 1, l2 - 1, ID, 1 );
}

void transASmany ( const int l, const int r ) {
	++ freq;
	int ils = 0; splitASdrug ( l, ils );
	int aim = ils; splitASdrug ( r, ils );
	for ( int i = 1; i <= aim; ++ i ) {
		for ( int j = aim + 1; j <= ils; ++ j )	transASsub ( itls[i].l, itls[i].r, itls[j].l, itls[j].r, freq );
	}
}

void add1 ( const int x ) { cur += buc2[col[x]], buc1[col[x]] ++; }
void add2 ( const int x ) { cur += buc1[col[x]], buc2[col[x]] ++; }
void sub1 ( const int x ) { cur -= buc2[col[x]], buc1[col[x]] --; }
void sub2 ( const int x ) { cur -= buc1[col[x]], buc2[col[x]] --; }
void captainMO () {
	int nowl = 0, nowr = 0;
	for ( int i = 1; i <= m; ++ i ) {
		for ( ; nowl < asq[i].l; add1 ( ++ nowl ) ) ;
		for ( ; nowr < asq[i].r; add2 ( ++ nowr ) ) ;
		for ( ; nowl > asq[i].l; sub1 ( nowl -- ) ) ;
		for ( ; nowr > asq[i].r; sub2 ( nowr -- ) ) ;
		ans[asq[i].ID] += cur * asq[i].x;
	}
}

int main () {
	n = rint (); int _waste_ = rint ();
	for ( int i = 1; i <= n; ++ i )	a[i] = pri[i] = rint ();
	for ( int i = 1; i < n; ++ i ) {
		int u = rint (), v = rint ();
		addE ( u, v ), addE ( v, u );
	}
	initial (), rt = 1;
	for ( int i = 1; i <= _waste_; ++ i ) {
		int c = rint (), x, y;
		if ( c == 1 )	rt = rint ();
		else	x = rint (), y = rint (), transASmany ( x, y );
	}
	sort ( asq + 1, asq + 1 + m, existcmp ), captainMO ();
	for ( int i = 1; i <= freq; ++ i )	wint ( ans[i] ), putchar ( '\n' );
	return 0;
}
```

# 66. CF1491H Yuezheng Ling and Dynamic Tree

~~所以 Chinese Round 出 DS 是传统了对吧。~~

## Description

[Link](https://www.luogu.com.cn/problem/CF1491H).

Given is a rooted tree with the $\sf1$-th node as the root.

The tree will be given in this way: it will tell you that the parent of the $\sf i$-th node is $a_{i}$.

Supporting the following operations:

- `1 l r x`: let $\sf \forall i\in[l,r],a_{i}=max\{a_{i}-x,1\}$.
- `2 u v`: find the LCA (Lowest Common Ancestor) of $\sf u$ and $\sf v$.

## Solution

![](uploads/6.webp)

经典永流传。

考虑到修改操作是对结点进行的操作，然后这个东西不太能直接 LCT 或树剖，考虑照序列来分块，那么我们来对结点编号分块。

1. 修改；

$\quad$维护一个属性 $\sf top_{u}$ 表示在原树上结点 $\sf u$ 的祖先中不和 $\sf u$ 在同一个块里面的编号最大的一个结点的编号，如果不存在的话就令 $\sf top_{u}=1$。这样的话你从结点 $\sf u$ 跳到 root 的复杂度为 $\sf O(\sqrt{n})$。接下来考虑怎么维护这个东西。

$\quad$散块我们直接暴力扫着改；对于整块，可以发现如果一个块的被修改次数超过了块的大小，那么就一定会有 $\sf top_{u}=fa_{u}$。

2. 询问。

$\quad$分三个类讨论，这个比较好做（差不多和树剖找 LCA 一个样子）。

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,m,top[100010],deln[320],tag[320],belong[100010],bl[320],br[320],fa[100010],bs;
#define gtlf(x) ((x-1)*bs+1)
#define gtrg(x) (min(x*bs,n))
void updtop(int x)
{
	if(belong[x]^belong[fa[x]])	top[x]=fa[x];
	else	top[x]=top[fa[x]];
}
void turndown(int x)
{
	if(tag[x])
	{
		for(int i=gtlf(x);i<=gtrg(x);++i)	fa[i]=max(fa[i]-tag[x],1);
		tag[x]=0;
	}
}
int main()
{
	scanf("%d %d",&n,&m),bs=sqrt(double(n))+1,fa[1]=belong[1]=1;
	for(int i=2;i<=n;++i)	scanf("%d",&fa[i]);
	for(int i=2;i<=n;++i)	belong[i]=(i-1)/bs+1,updtop(i);
	while(m--)
	{
		int opt; scanf("%d",&opt);
		if(opt==1)
		{
			int opl,opr,opx;
			scanf("%d %d %d",&opl,&opr,&opx);
			turndown(belong[opl]);
			if(belong[opl]==belong[opr])
			{
				turndown(belong[opl]);
				for(int i=opl;i<=opr;++i)	fa[i]=max(fa[i]-opx,1),updtop(i);
				for(int i=opr+1;i<=gtrg(belong[opl]);++i)	updtop(i);
			}
			else
			{
				turndown(belong[opl]);
				for(int i=opl;i<=gtrg(belong[opl]);++i)	fa[i]=max(fa[i]-opx,1),updtop(i);
				for(int i=gtlf(belong[opl]);i<opl;++i)	updtop(i);
				turndown(belong[opr]);
				for(int i=gtlf(belong[opr]);i<=opr;++i)	fa[i]=max(fa[i]-opx,1),updtop(i);
				for(int i=opr+1;i<=gtrg(belong[opr]);++i)	updtop(i);
				for(int i=belong[opl]+1;i<belong[opr];++i)
				{
					if(deln[i]>=bs)	tag[i]+=opx;
					else
					{
						++deln[i];
						for(int j=gtlf(i);j<=gtrg(i);++j)	fa[j]=max(fa[j]-opx,1),updtop(j);
					}
				}
			}
		}
		else
		{
			int opx,opy; scanf("%d %d",&opx,&opy);
			while(opx^opy)
			{
				int fopx,fopy;
				if(deln[belong[opx]]>=bs)	turndown(belong[opx]),fopx=fa[opx];
				else	fopx=top[opx];
				if(deln[belong[opy]]>=bs)	turndown(belong[opy]),fopy=fa[opy];
				else	fopy=top[opy];
				if(belong[opx]^belong[opy])
				{
					if(belong[opx]>belong[opy])	opx=fopx;
					else	opy=fopy;
				}
				else if(fopx^fopy)	opx=fopx,opy=fopy;
				else
				{
					if(opx>opy)	turndown(belong[opx]),opx=fa[opx];
					else	turndown(belong[opy]),opy=fa[opy];
				}
			}
			printf("%d\n",opx);
		}
	}
	return 0;
}
```

# 67. 「NOI2020」时代的眼泪

小 L 喜欢与智者交流讨论，而智者也经常为小 L 出些思考题。

这天智者又为小 L 构思了一个问题。智者首先将时空抽象为了一个二维平面，进而将一个事件抽象为该平面上的一个点，将一个时代抽象为该平面上的一个矩形。

为了方便，下面记 $(a, b) \leq (c, d)$ 表示平面上两个点 $(a, b),(c, d)$ 满足 $a \leq c, b \leq d$。

更具体地，智者给定了 $n$ 个**事件**，他们用平面上 $n$ 个不同的点 $\{(x_i, y_i)\}^n_{i=1}$ 来表示；智者还给定了 $m$ 个**时代**，每个时代用平面上一个矩形 $(r_{i,1}, r_{i,2}, c_{i,1}, c_{i,2})$ 来表示，其中 $(r_{i,1}, c_{i,1})$ 是矩形的左下角，$(r_{i,2}, c_{i,2})$ 是矩形的右上角，保证 $(r_{i,1}, c_{i,1}) \leq (r_{i,2}, c_{i,2})$。我们称时代 $i$ 包含了事件 $j$ 当且仅当 $(r_{i,1}, c_{i,1}) \leq (x_j, y_j ) \leq (r_{i,2}, c_{i,2})$。

智者认为若两个事件 $i, j$ 满足 $(x_i, y_i) \leq (x_j, y_j)$，则这两个事件形成了一次**遗憾**。而对一个时代内包含的所有事件，它们所形成的遗憾被称为这个**时代的眼泪**，而形成的遗憾次数则称为该时代的眼泪的大小。现在智者想要小 L 计算**每个时代的眼泪的大小**。

小 L 明白，如果他回答不了这个问题，他也将成为时代的眼泪，请你帮帮他。

----

> 膜拜 dX。
>
> 基本是把 dX 的题解贺了过来所以没啥参考的价值。
>
> 不过有很多细节的处理不一样，大概能算个 $\frac{1}{50}$ 成新？

对序列分块，把贡献分成 整块 - 散块 / 整块 - 整块/ 散块 - 整块 / 散块 - 散块 以及 散块内部 / 整块内部 共六种贡献。

记 $\textit{ans}_{0}(l,r,x,y)$ 为询问 $l,r,x,y$ 的答案。

同时预处理出 $\textit{lb}(i,j),\textit{ub}(i,j)$ 分别表示在块 $i$ 中数 $j$ 的 `std::lower_bound` / `std::upper_bound` 值，下文如果写成单元函数的形式那么就是省去了第一维。

以及预先做一个块内排序，记为 $\textit{ord}(i,j)$，表示块 $i$ 中排序后的第 $j$ 个元素。

**注意本文在每个 subtask 定义的东西在其他 subtask 依然适用**。

- 散块 - 散块；

两边的都是 $\sqrt{n}$ 级别，拉出来分别排序后归并计算顺序对即可。

- 散块内部

考虑如何对 $\textit{ans}_{0}(l,r,x,y)$ 进行容斥。

主要矛盾集中在：会出现 $(a\in[1,x),b\in[x,y])$ 这样的贡献。令 $\textit{cnt}_{0}(i,j)$ 表示 $[\textit{lp},i]$ 中 $\textit{rank}_{1}$ 小于 $j$ 的数的数量，其中 $\textit{lp}$ 是当前块的左端点，下同，如果出现 $\textit{rp}$ 同理，$\textit{rank}_{1}$ 的定义见下文。

则容斥可以写为 $\textit{ans}_{0}(l,r,x,y)=\textit{ans}_{0}(l,r,1,y)-\textit{ans}_{0}(l,r,1,x-1)-\sum_{i=l}^{r}[a_{i}\in[x,y]]\cdot\textit{cnt}_{0}(i,\textit{lb}(x)-1)$。

又有 $\textit{ans}_{0}(l,r,1,x)=\sum_{i=l}^{r}[a_{i}\leqslant x]\cdot\textit{cnt}_{0}(i,\textit{rank}_{1}(i))$，我们就可以做到单次 $\mathcal{O}(\sqrt{n})$，注意的 $l,r$ 触及散块边界者不同时，对 $\textit{cnt}_{0}$ 的容斥也有区别。

- 整块 - 整块

令 $\textit{cnt}_{1}(i,j)$ 为块 $[1,i]$ 中 $\leqslant j$ 的元素个数，$\textit{ans}_{1}(L,R,x,y)$ 为块 $[L,R]$ 的答案，以及 $\textit{rank}_{0}(i,j)$ 是块 $i$ 中排名 $j$ 的元素在原数组中的下标。

我们掏出传统容斥：$\textit{ans}_{1}(L,R,x,y)=\textit{ans}_{1}(L,R,1,y)-\textit{ans}_{1}(L,R,1,x-1)-\sum_{i=L}^{R}P_{i}Q_{i}$，$P_{i}$ 是块 $[L,i)$ 中 $<x$ 的元素个数，$Q_{i}$ 是块 $i$ 种 $\in[x,y]$ 的元素个数。

考虑算 $\textit{ans}_{1}(L,R,1,x)$。

定义 $\textit{rank}_{1}(i,j)$ 为块 $i$ 中第 $j$ 个元素的排名（从小到大，下同），$\textit{rank}_{2}(i,j)$ 为块 $i$ 中满足 $<j$ 的最大元素的排名，$\textit{pre}_{b}(i,j)$ 为块 $[i,j]$ 中所有 $<\textit{rank}_{1}(i,j)$ 的元素数量。

易知 $\textit{pre}_{b}(i,j)=\textit{cnt}_{1}(i,\textit{rank}_{1}(i,j)-1)$，再定义 $\overset{\sqrt{n},\sqrt{n},\sqrt{n}}{\textit{cp}_{0}(i,L,r)}$ 为块 $[1,L]$ 与块 $i$ 前 $r$ 小的元素组成的顺序对数量，同样易知 $\textit{cp}_{0}(i,L,r)=\sum_{k\in T}[\textit{rank}_{1}(i,k)\leqslant r]\cdot\textit{pre}_{b}(L,\textit{rank}_{1}(i,k))$，其中 $T$ 是块 $i$ 的元素集。但这样搞状态数 $\mathcal{O}(n\sqrt{n})$ 转移还要 $\mathcal{\sqrt{n}}$ 而且不好前缀和。

不过可以发现使用 $\textit{ord}$ 数组 $\textit{cp}_{0}$ 就可以递推了：$\textit{cp}_{0}(i,L,r)=\sum_{k=lp}^{r+lp-1}\textit{pre}_{b}(L,k)=\textit{cp}_{0}(i,L,r-1)+\textit{pre}_{b}(L,r+lp-1)$。

然后 $\textit{ans}_{1}(L,R,1,x)=\sum_{i=L+1}^{R}\textit{cp}_{0}(i,i-1,\textit{rank}_{2}(i,x))-\textit{cp}_{0}(i,L-1,\textit{rank}_{2}(i,x))$。

预处理 $\textit{cp}_{0}$ 是 $\mathcal{O}(n\sqrt{n})$，单次回答 $\mathcal{O}(\sqrt{n})$。

- 散块 - 整块

枚举散块里面的元素，利用 $\textit{cnt}_{1}(i,j)$ 计算答案。

具体是令散块元素集为 $T$，整块编号为 $L,R$， $\sum_{i\in T}\textit{cnt}_{1}(R,i)-\textit{cnt}_{1}(L-1,i)$。

- 整块 - 散块

和上面有什么区别吗？

- 整块内部

预处理数组 $\overset{\sqrt{n},\sqrt{n},\sqrt{n}}{\textit{cp}_{1}(i,x,y)}$ 表示取 $\textit{ord}(i,x\dots y)$ 组成的序列的顺序对数量。

用 $\textit{rank}_{0}$ 来预处理：$\textit{cp}_{1}(i,x,y)=\textit{cp}_{1}(i,x,y-1)+\textit{cnt}_{0}(\textit{rank}_{0}(i,y),y-1)-\textit{cnt}_{0}(\textit{rank}_{0}(i,y),x-1)$。

---

综上，这个问题得以一个 $\mathcal{O}(n\sqrt{n})$ 的在线算法解决。

```cpp
//almost copied from dead_X sry
//kouhu has no qiantu
#include<bits/stdc++.h>
typedef long long ll;
using namespace std;
#define getchar() (p1==p2 && (p2=(p1=buf)+fread(buf,1,1<<21,stdin),p1==p2)?EOF:*p1++)
char buf[1<<21],*p1=buf,*p2=buf;
inline int read()
{
	int x=0;char c=getchar();
	while(c<'0' || c>'9') c=getchar();
	while(c>='0' && c<='9') x=x*10+(c&15),c=getchar();
	return x;
}
const int N=101111,A=400,BS=A+10;
ll cp0[BS][BS][BS];
int a[N],rk0[BS][BS],cnt0[N][BS],cp1[BS][BS][BS],lb[BS][N],rk1[N],cnt1[BS][N],L[BS],R[BS];
bool cmp(int x,int y) { return a[x]<a[y]; }
int main(){
#ifdef ONLINE_JUDGE
	freopen("tears.in","r",stdin);
	freopen("tears.out","w",stdout);
#endif
	int n=read(),m=read(),B=n/A;
	for(int i=0;i<n;++i)a[i]=read();
	for(int i=n;i<(B+1)*A;++i)a[i]=i;
	for(int i=0;i<=B;++i){
		for(int j=i*A,k=0;k<A;++j,++k)rk0[i][k]=j;
		sort(rk0[i],rk0[i]+A,[](int x,int y){return a[x]<a[y];});
		for(int j=0;j<A;++j)rk1[rk0[i][j]]=j,cnt0[rk0[i][j]][j]=1;
		for(int j=i*A+1;j<(i+1)*A;++j)
			for(int k=0;k<A;++k)cnt0[j][k]+=cnt0[j-1][k];
		for(int j=i*A;j<(i+1)*A;++j)
			for(int k=1;k<A;++k)cnt0[j][k]+=cnt0[j][k-1];
		for(int j=i*A;j<(i+1)*A;++j)++cnt1[i][a[j]];
		if(i)for(int j=1;j<=101000;++j)cnt1[i][j]+=cnt1[i-1][j];
		for(int j=1,k=0;j<=101000;++j)(k<A)&&(j>=a[rk0[i][k]])&&(++k),lb[i][j]=k;
	}
	for(int i=0;i<=B;++i)
		for(int j=1;j<=101000;++j)cnt1[i][j]+=cnt1[i][j-1];
	for(int i=1;i<B;++i)for(int j=0;j<i;++j)for(int k=0;k<A;++k)
		cp0[i][j][k+1]=cnt1[j][a[rk0[i][k]]]+cp0[i][j][k];
	for(int i=0;i<B;++i)for(int j=0;j<A;++j)for(int k=j+1;k<A;++k)
		cp1[i][j][k]=cp1[i][j][k-1]+cnt0[rk0[i][k]][k-1]-((j==0)?0:cnt0[rk0[i][k]][j-1]);
	for(;m;--m){
		int l=read()-1,r=read()-1,x=read(),y=read(),bl=l/A,br=r/A;
		if(bl==br){
			int ans=0;
			for(int i=l;i<=r;++i){
				if(x<=a[i]&&a[i]<=y&&rk1[i])ans+=cnt0[i][rk1[i]-1]-((l%A)?cnt0[l-1][rk1[i]-1]:0);
				if(lb[bl][x-1]&&x<=a[i]&&a[i]<=y)ans-=cnt0[i][lb[bl][x-1]-1]-((l%A&&lb[bl][x-1])?cnt0[l-1][lb[bl][x-1]-1]:0);
			}
			printf("%d\n",ans);
		}
		else{
			ll ans=0;
			for(int i=l;i<(bl+1)*A;++i){
				if(x<=a[i]&&a[i]<=y&&rk1[i])ans+=cnt0[i][rk1[i]-1]-((l%A)?cnt0[l-1][rk1[i]-1]:0);
				if(lb[bl][x-1]&&x<=a[i]&&a[i]<=y)ans-=cnt0[i][lb[bl][x-1]-1]-((l%A&&lb[bl][x-1])?cnt0[l-1][lb[bl][x-1]-1]:0);
				if(x<=a[i]&&a[i]<=y)ans+=cnt1[br-1][y]-cnt1[bl][y]-cnt1[br-1][a[i]]+cnt1[bl][a[i]];
			}
			for(int i=br*A;i<=r;++i){
				if(x<=a[i]&&a[i]<=y&&rk1[i])ans+=cnt0[i][rk1[i]-1];
				if(lb[br][x-1]&&x<=a[i]&&a[i]<=y)ans-=cnt0[i][lb[br][x-1]-1];
				if(x<=a[i]&&a[i]<=y)ans+=cnt1[br-1][a[i]]-cnt1[bl][a[i]]-cnt1[br-1][x-1]+cnt1[bl][x-1];
			}
			int lt=0,rt=0;
			for(int i=0;i<A;++i){
				if(rk0[bl][i]>=l&&x<=a[rk0[bl][i]]&&a[rk0[bl][i]]<=y)L[++lt]=rk0[bl][i];
				if(rk0[br][i]<=r&&x<=a[rk0[br][i]]&&a[rk0[br][i]]<=y)R[++rt]=rk0[br][i];
			}
			for(int i=1,t=1;i<=rt;++i){
				while(t<=lt&&a[L[t]]<a[R[i]])++t;
				ans+=t-1;
			}
			for(int i=bl+1;i<br;++i)if(lb[i][y])ans+=cp1[i][lb[i][x-1]][lb[i][y]-1];
			for(int i=bl+2;i<br;++i)
				ans+=cp0[i][i-1][lb[i][y]]-cp0[i][bl][lb[i][y]]-cp0[i][i-1][lb[i][x-1]]+cp0[i][bl][lb[i][x-1]],
				ans-=ll(cnt1[i][y]-cnt1[i-1][y]-cnt1[i][x-1]+cnt1[i-1][x-1])*(cnt1[i-1][x-1]-cnt1[bl][x-1]);
			printf("%lld\n",ans);
		}
	}
	return 0;
}
```
    