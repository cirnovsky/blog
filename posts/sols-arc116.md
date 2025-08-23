---
date: 2021-04-06
title: Solution Set -「ARC 116」（in progress）
category: notes
tags: [number-theory,bitwise,combinatorics]
---

# 「ARC 116A」Odd vs Even

[Link](https://atcoder.jp/contests/arc116/tasks/arc116_a).

看 $n$ 有多少 $2$ 因子。

<details>

```cpp
// Problem: A - Odd vs Even
// Contest: AtCoder - AtCoder Regular Contest 116
// URL: https://atcoder.jp/contests/arc116/tasks/arc116_a
// Memory Limit: 1024 MB
// Time Limit: 2000 ms
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>
using namespace std;
typedef long long LL;
int make_two(LL n){int res=0; while((n&1ll)^1ll)	++res,n>>=1; return res;}
int main()
{
	int T; scanf("%d",&T);
	while(T--)
	{
		LL n;
		scanf("%lld",&n);
		int one=make_two(n);
		if(one==1)	puts("Same");
		else if(one>1)	puts("Even");
		else	puts("Odd");
	}
	return 0;
}
```

</details>

# 「ARC 116B」Products of Min-Max

[Link](https://atcoder.jp/contests/arc116/tasks/arc116_b).

感觉这题很平庸很 B 题啊，不知道为什么那么多人说难……

首先排序，于是即算
$$
\left(\sum_{i=1}^{n}\sum_{j=i+1}^{n}a_{i}\times a_{j}\times2^{j-i-1}\right)+\left(\sum_{i=1}^{n}a_{i}^{2}\right)
$$

也就是

$$
\sum_{i=1}^{n}a_{i}\sum_{j=i+1}^{n}a_{j}\times2^{j-i-1} \\
$$

又
$$
\sum_{j=i}^{n}a_{j}\times2^{j-i}=2\left(\sum_{j=i+1}^{n}a_{j}\times2^{j-i-1}\right)+a_{i}
$$

于是直接 $\mathcal{O}(n)$ 算即可。智慧官方 editorial 指着这个式子说 $\mathcal{O}(n\log_{2}n)$ 不知道在干嘛。所以爆了个没什么用的标。

<details>

```cpp
// Problem: B - Products of Min-Max
// Contest: AtCoder - AtCoder Regular Contest 116
// URL: https://atcoder.jp/contests/arc116/tasks/arc116_b
// Memory Limit: 1024 MB
// Time Limit: 2000 ms
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>
using namespace std;
typedef long long LL;
const int MOD=998244353;
int n,a[200010],ans,sum;
int main()
{
	scanf("%d",&n);
	for(int i=1;i<=n;++i)	scanf("%d",&a[i]);
	sort(a+1,a+n+1);
	for(int i=1;i<=n;++i)
	{
		ans=(ans+LL(sum)*a[i]%MOD+LL(a[i])*a[i]%MOD)%MOD;
		sum=((LL(sum)<<1)%MOD+a[i])%MOD;
	}
	printf("%d\n",ans);
	return 0;
}
```

</details>

# 「ARC 116C」Multiple Sequences

[Link](https://atcoder.jp/contests/arc116/tasks/arc116_c).

我们只考虑每个序列的末尾，即 $A_{n}=1,\cdots,m$ 的情况。我们先来想暴力。

对于每一个 $A_{n}$ 的取值，记为 $d$，对 $d$ 分解质因数，$d=\prod_{i=1}^{k}p_{i}^{c_{i}}$。

然后对于这个 $d$，其可以构成的序列数即 $\prod_{i=1}^{k}\binom{n+c_{i}-1}{c_{i}}$。

考虑非暴力，就把素数筛出来就行了。

<details>


```cpp
// Problem: C - Multiple Sequences
// Contest: AtCoder - AtCoder Regular Contest 116
// URL: https://atcoder.jp/contests/arc116/tasks/arc116_c
// Memory Limit: 1024 MB
// Time Limit: 2000 ms
// 
// Powered by CP Editor (https://cpeditor.org)

#include<bits/stdc++.h>
using namespace std;
typedef long long LL;
const int MOD=998244353;
vector<int> makePrime(int n)
{
	vector<int> prime,tag(n+1);
	tag[1]=1;
	for(int i=2;i<=n;++i)
	{
		if(!tag[i])	prime.push_back(i);
		for(int j=0;j<int(prime.size()) && i*prime[j]<=n;++j)
		{
			tag[i*prime[j]]=1;
			if(i%prime[j]==0)	break;
		}
	}
	return prime;
}
int n,m,ans;
vector<int> fac,ifac;
void exGCD(int one,int ano,int &x,int &y)
{
	if(ano==0)	x=1,y=0;
	else	exGCD(ano,one%ano,y,x),y-=(one/ano)*x;
}
int getInv(int val){int res,w; exGCD(val,MOD,res,w); return (res+MOD)%MOD;}
int C(int n,int k){return n<k?0:LL(fac[n])*ifac[k]%MOD*ifac[n-k]%MOD;}
int main()
{
	scanf("%d %d",&n,&m);
	vector<int> prime=makePrime(200100);
	fac.push_back(1);
	for(int i=1;i<=200100;++i)	fac.push_back(LL(fac.back())*i%MOD);
	for(int i=0;i<=200100;++i)	ifac.push_back(getInv(fac[i]));
	for(int i=1;i<=m;++i)
	{
		int curm=i,tmp=1;
		for(int j=0;j<int(prime.size()) && prime[j]<=curm;++j)
		{
			if(curm%prime[j]==0)
			{
				int ups=0;
				while(curm%prime[j]==0)	curm/=prime[j],++ups;
				tmp=LL(tmp)*C(n+ups-1,ups)%MOD;
			}
		}
		ans=(ans+tmp)%MOD;
	}
	printf("%d\n",ans);
	return 0;
}
```

</details>

# 「ARC 116D」I Wanna Win The Game

[Link](https://atcoder.jp/contests/arc116/tasks/arc116_d).

这题的 DP 感觉略有点难往这方面想。

考虑这题的限制最强的是 $\texttt{XOR}$ 和为 $0$ 以及和恰为 $m$。可以大概猜测此题与 $n$ 关系不大。

那么我们可以考虑从最低位开始做这个题。 

设 $f_{i}$ 为构造出来序列的和为 $i$ 且 $\texttt{XOR}$ 和为 $0$ 的数量。

<details>

```cpp
Oops, something went wrong.
```

</details>

# 「ARC 116E」Spread of Information

[Link](https://atcoder.jp/contests/arc116/tasks/arc116_e).

<details>

```cpp
Oops, something went wrong.
```

</details>

# 「ARC 116F」Deque Game

[Link](https://atcoder.jp/contests/arc116/tasks/arc116_f).

<details>

```cpp
Oops, something went wrong.
```

</details>
    