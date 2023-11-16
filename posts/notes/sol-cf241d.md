---
date: '2020-08-07'
title: 'Solution -「CF 241D」Numbers'

---

## 题意简述

给你一个 $n$ 的排列和一个整数 $p$，要求留下若干个数字，使得剩下的数字异或为 $0$，并且从左到右串联起来可以被 $p$ 整除，输出任意一组这样的方案。

## 题解

又是一道奇奇怪怪的题。

先打了个暴力的 DFS。

然后通过这个暴力，我大概了解了一个情况：1~24 的排列组成的异或和为零的方案数远大于模数的极值。

也就是说什么呢，我们可以近似把异或和为零的序列模 $p$ 为 0 看作是一个随机事件。

那么我们就可以乱搞了呀，直接抛弃过大的数字（大约理论瞎 bb 了一下这个阈值取了 25，看到楼下 iostream 的题解发现可以取到 24）。

然后又因为这个是一个排列，所以留下来的数为 $S$ 个，即阈值。

于是我们就可以 $\Theta(2^{S})$ 次方暴搜，直接搜出答案。

```cpp
#include <cstdio>
#include <vector>

using namespace std;

int n, p, over, pos[50], ans[50];
vector < int > disc;

int connect(int now, int val, int mod) // 连接数
{
	if (val < 10)	now = now * 10 + val;
	else	now = now * 100 + val;
	return now % mod;
}

void dfs(int now, int siz, int exc, int cnt) // 搜到第几个数字，已选择的数字个数，当前异或和，当前选择的数字连接起来 mod p 的值
{
	if (over)	return ;
	if (siz != 0 && exc == 0 && cnt == 0)
	{
		printf("Yes\n%d\n", siz);
		for (int i = 1; i <= siz; ++i)	printf("%d ", ans[i - 1]);
		over = 1;
		return ;
	}
	if (now == (int)disc.size())	return ;
	ans[siz] = pos[now];
	dfs(now + 1, siz + 1, exc ^ disc[now], connect(cnt, disc[now], p));
	dfs(now + 1, siz, exc, cnt);
}

signed main()
{
	scanf("%d %d", &n, &p);
	disc.push_back(0);
	for (int i = 1, x; i <= n; ++i)
	{
		scanf("%d", &x);
		if (x <= 24)
		{
			disc.push_back(x);
			pos[disc.size() - 1] = i;
		}
	}
	dfs(1, 0, 0, 0);
	if (over == 0)	puts("No");
	return 0;
}
```