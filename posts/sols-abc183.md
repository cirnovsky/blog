---
date: 2021-01-12
title: Solution Set -「ABC 183」
category: notes
tags: [maths,data-structures,geometry,brute-force]
---

本来十分抗拒，但 GM 强制。

# 「ABC 183A」ReLU

[Link](https://atcoder.jp/contests/abc183/tasks/abc183_a?lang=en).

略。

<details>

```cpp
#include<cstdio>
int main()
{
	long long n;
	scanf("%lld",&n);
	printf("%lld\n",n>0?n:0);
	return 0;
}
```

</details>

# 「ABC 183B」Billiards

[Link](https://atcoder.jp/contests/abc183/tasks/abc183_b?lang=en).

设答案坐标 $A(m,n)$，然后算出 $y_{AG}$ 解析式，再带 $x=S'_{x}$，$S'$ 是 $S$ 关于直线 $x=m$ 的对称点，得出来的 $y$ 要等于 $n$，然后列个方程解出来答案为 $\frac{S_{x}G_{y}+G_{x}S_{y}}{S_{y}+G_{y}}$。

<details>

```cpp
#include<cstdio>
double sx,sy,gx,gy;
int main()
{
	scanf("%lf%lf%lf%lf",&sx,&sy,&gx,&gy);
	printf("%lf\n",(sx*gy+gx*sy)/(sy+gy));
	return 0;
}
```

</details>

# 「ABC 183C」Travel

[Link](https://atcoder.jp/contests/abc183/tasks/abc183_c?lang=en).

全排列枚举算答案即可。

<details>

```cpp
#include<cstdio>
#include<vector>
#include<algorithm>
using namespace std;
vector<int> per;
int n,ans;
long long k,tim[20][20];
int main()
{
	scanf("%d%lld",&n,&k);
	for(int i=1;i<=n;++i)
	{
		for(int j=1;j<=n;++j)	scanf("%lld",&tim[i][j]);
	}
	per.resize(n+2);
	for(int i=1;i<=n;++i)	per[i]=i;
	per[n+1]=1;
	do
	{
		long long sum=0;
		for(int i=2;i<=n+1;++i)	sum+=tim[per[i-1]][per[i]];
		if(sum==k)	++ans;
	}while(next_permutation(per.begin()+2,per.end()-1));
	printf("%d\n",ans);
	return 0;
}
```

</details>

# 「ABC 183D」Water Heater

[Link](https://atcoder.jp/contests/abc183/tasks/abc183_d?lang=en).

前缀和。

<details>

```cpp
#include<cstdio>
int n,s[200010],t[200010],p[200010],w;
long long dif[200010];
int main()
{
	scanf("%d%d",&n,&w);
	for(int i=1;i<=n;++i)	scanf("%d%d%d",&s[i],&t[i],&p[i]);
	for(int i=1;i<=n;++i)
	{
		dif[s[i]]+=p[i];
		dif[t[i]]-=p[i];
	}
	for(int i=1;i<=200000;++i)	dif[i]+=dif[i-1];
	for(int i=0;i<=200000;++i)
	{
		if(dif[i]>w)
		{
			printf("No\n");
			return 0;
		}
	}
	printf("Yes\n");
	return 0;
}
```

</details>

# 「ABC 183E」Water Heater

[Link](https://atcoder.jp/contests/abc183/tasks/abc183_e?lang=en).

递推完了。

<details>

```cpp
#include<cstdio>
const int mod=1e9+7;
long long ans;
int n,m,mp[2010][2010],row[2010],col[2010],dia[5010];
char str[2010];
int add(long long a,long long b)
{
	if(a+b>=mod)	return (a+b)%mod;
	else	return a+b;
}
int main()
{
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;++i)
	{
		scanf("%s",str+1);
		for(int j=1;j<=m;++j)
		{
			if(str[j]=='.')	mp[i][j]=0;
			else	mp[i][j]=1;
		}
	}
	int lay=2e3;
	for(int i=1;i<=n;++i)
	{
		for(int j=1;j<=m;++j)
		{
			if(mp[i][j])
			{
				row[i]=0;
				col[j]=0;
				dia[i-j+lay]=0;
			}
			else
			{
				int tmp=add(add(row[i],col[j]),dia[i-j+lay]);
				if(i==1&&j==1)	++tmp;
				row[i]=add(row[i],tmp);
				col[j]=add(col[j],tmp);
				dia[i-j+lay]=add(dia[i-j+lay],tmp);
				ans=tmp;
			}
		}
	}
	printf("%d\n",ans);
	return 0;
}
```

</details>

# 「ABC 183F」Confluence

[Link](https://atcoder.jp/contests/abc183/tasks/abc183_f?lang=en).

并查集板。

<details>

```cpp
#pragma GCC diagnostic error "-std=c++11"
#include<map>
#include<cstdio>
using namespace std;
map<int,int> mp[200010];
int n,m,fa[200010];
void makeset()
{
	for(int i=1;i<=n;++i)	fa[i]=i;
}
int findset(int x)
{
	if(x^fa[x])	fa[x]=findset(fa[x]);
	return fa[x];
}
void mergeset(int x,int y)
{
	x=findset(x);
	y=findset(y);
	if(x^y)
	{
		if(mp[x].size()>mp[y].size())
		{
			fa[y]=x;
			for(auto p:mp[y])	mp[x][p.first]+=p.second;
		}
		else
		{
			fa[x]=y;
			for(auto p:mp[x])	mp[y][p.first]+=p.second;
		}
	}
}
int main()
{
	scanf("%d%d",&n,&m);
	makeset();
	for(int i=1;i<=n;++i)
	{
		int x;
		scanf("%d",&x);
		mp[i][x]++;
	}
	while(m--)
	{
		int opt,opx,opy;
		scanf("%d%d%d",&opt,&opx,&opy);
		if(opt==1)	mergeset(opx,opy);
		else
		{
			int tmp=findset(opx);
			printf("%d\n",mp[tmp][opy]);
		}
	}
	return 0;
}
```

</details>
    