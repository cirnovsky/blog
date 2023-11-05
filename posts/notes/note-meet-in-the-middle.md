---
date: '2020-08-04'
title: 'Note -「Meet in the Middle」'

---

## 0x01 算法

对于数据范围在 $40$ 左右的搜索题可以考虑使用根号搜索。

比如我们当前的搜索函数 $\text{search}$ 的复杂度为 $\Theta(x^{n})$，此时我们可以采用根号搜索，把复杂度降到 $\Theta(\sqrt{x^{n}}+S)$，其中 $S$ 后面讲。

假设我们有了一个朴素的搜索算法 $\text{search}$，$\text{search}$ 搜索的东西假设是一个长度为 $n$ 的序列。

那么我们可以使用 $\text{search}$ 先搜 $[1,\lfloor\frac{n}{2}\rfloor]$，计算出这一部分的贡献，然后搜索 $[\lfloor\frac{n}{2}\rfloor+1,n]$，计算贡献。

然后合并贡献即可。

前面复杂度里的 $S$ 即合并贡献的时间复杂度。

你也可以叫它折半搜索，反正看你怎么理解这个东西。

## 0x02 例题

 **译自 [CEOI2015](https://ceoi2015.fi.muni.cz/tasks.php) Day2 T1「[Ice Hockey World Championship](https://ceoi2015.fi.muni.cz/day2/eng/day2task1-eng.pdf)」**

> 今年的世界冰球锦标赛在捷克举行。Bobek 已经抵达布拉格，他不是任何团队的粉丝，也没有时间观念。他只是单纯的想去看几场比赛。如果他有足够的钱，他会去看所有的比赛。不幸的是，他的财产十分有限，他决定把所有财产都用来买门票。

> 给出 Bobek 的预算和每场比赛的票价，试求：如果总票价不超过预算，他有多少种观赛方案。如果存在以其中一种方案观看某场比赛而另一种方案不观看，则认为这两种方案不同。

```cpp[class="line-numbers"]
#include <cstdio>
#include <algorithm>
#include <queue>

using namespace std;

const int Maxn = 40 + 5;
long long n, m, ans, isa[Maxn];
vector < long long > disc[2];

void dfs(int l, int r, long long s, int x)
{
	if (s > m)	return ;
	if (l > r)
	{
		disc[x].push_back(s);
		return ;
	}
	dfs(l + 1, r, s + isa[l], x);
	dfs(l + 1, r, s, x);
}

signed main()
{
	scanf("%lld %lld", &n, &m);
	for (int i = 1; i <= n; ++i)	scanf("%lld", &isa[i]);
	dfs(1, n >> 1, 0, 0);
	dfs((n >> 1) + 1, n, 0, 1);
	sort(disc[0].begin(), disc[0].end());
	for (auto it : disc[1])
	{
		int src = upper_bound(disc[0].begin(), disc[0].end(), m - it) - disc[0].begin();
		ans += src;
	}
	printf("%lld\n", ans);
	return 0;
}
```