---
date: '2020-04-11'
title: 'Note -「Efficient Segment Tree」'
category: 'Notes'
---

# 0x00 前言

线段树的码量对于初学者来说十分不友好，而且就算理解了板子到了实际应用时也很容易在码代码的时候漏掉一些细节。而且线段树的四倍空间也可能被卡（虽然我没见过）（但总归是多了一些开销），导致有时候我们不得不使用其他的数据结构。最重要的是，由于递归等原因，传统形式的线段树的常数很大。

那么在这里我将介绍一种基于循环的、空间只需开两倍的较于传统形式的线段树更加简洁高效的线段树的形式。（甚至可以锤BIT）

这个东西是我在AI.Cash神仙那里学的，这里给出他的文章链接：[https://codeforc.es/blog/entry/18051](https://codeforc.es/blog/entry/18051)

# 0x01 第一部分

我们首先考虑两种操作：单点更新和区间。这里我们假设 $n=2^{p},p\in\mathbb{N}$。

举个例子，当 $n=2^{4}$，我们画出线段树的图示。

![uTools_1586481130160.png](https://i.loli.net/2020/04/10/ZBnqSPo9RJLEOxt.png)

（我画图花了一年……）

首先我们考虑建树，先给出建树的代码实现：

```cpp
void build() {
	for (int i = n - 1; i >= 1; --i) t[i] = t[i << 1] + t[i << 1 | 1];
}
```

结合图例就很好理解。建树比较显然，就不多赘述了。时间复杂度显然 $\Theta(n)$

然后是单点修改，先给代码：

```cpp
void modify(int pos, int val) {
	for (t[pos += n] = val; pos > 1; pos >>= 1) t[pos >> 1] = t[pos] + t[pos ^ 1];
}
```

举个例子，我们现在要修改第1个元素，也就是17号节点。首先我们把`pos += n`，这样我们就定位到了序列的第1个元素在线段树对应的叶子节点也就是17号节点。此时我们修改叶子节点。然后我们往上找父亲节点，`pos >> 1`可以帮我们找到一个节点的父亲节点。`pos`和`pos ^ 1`稍微了解位运算就能知道，不多赘述。时间复杂度显然 $\Theta(\log_{2}n)$。

再来考虑区间查询，同样先给代码再讲解。

```cpp
int queryf(int l, int r) {
	int res = 0;
	for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
		if (l & 1) res += t[l++];
		if (r & 1) res += t[--r];
	}
	return res;
}
```
同样举个例子，比如我们要求 $[3,11)$ 的和，那么我们只需要求出节点编号为19、5、12、26的和即可。看图理解。

![uTools_1586481130160.png](https://i.loli.net/2020/04/10/6JBQi1Wg5sIf7tp.png)

看向代码，首先我们把 $l$ 和 $r$ 分别加 $n$，获取到3和10在线段树的节点编号。然后根据 $l$ 和 $r$ 的奇偶性判断是其父节点的左儿子还是右儿子，然后加起来即可。注意区间是左闭右开的。时间复杂度依然显然 $\Theta(\log_{2}n)$

当然，当 $n\neq 2^{p},p\in\mathbb{N}$ 时，以上的结论和代码依然成立。

让我们来看一道板题，[P3374 「模板」树状数组1](https://www.luogu.com.cn/problem/P3374)

代码和上面差不多，我直接给了：

```cpp
#include <cstdio>

const int N = 5e5 + 5;
int n, m, t[N << 1];

void build() {
    for (int i = n - 1; i > 0; --i) t[i] = t[i << 1] + t[i << 1 | 1];
}

void modify(int p, int val) {
    for (t[p += n] += val; p > 1; p >>= 1) t[p >> 1] = t[p] + t[p ^ 1];
}

int queryf(int l, int r) {
    int res = 0;
    for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
        if (l & 1) res += t[l++];
        if (r & 1) res += t[--r];
    }
    return res;
}

signed main() {
    scanf("%d %d", &n, &m);
    for (int i = 0; i < n; ++i) scanf("%d", &t[i + n]);
    build();
    for (int i = 0, opt, x, y; i < m; ++i) {
        scanf("%d %d %d", &opt, &x, &y);
        if (opt == 1) modify(x - 1, y);
        else printf("%d\n", queryf(x - 1, y));
    }
    return 0;
}
```

好，让我们来关注一下用时：

- 树状数组：829~1.07ms Accepted
- 线段树（我的大常数版）：4.98S Time Limit Exceeded
- 线段树（LYC的小常数版）：1.53S Accepted
- 线段树（今天介绍的版本）：925ms Accepted

可以看到，我们今天的循环线段树的常数几乎和素来以小常数著称的BIT差不多甚至更优了。

空间开销：

- 树状数组：8.04MB
- 线段树（我的大常数版）：16.57MB
- 线段树（LYC的小常数版）：23.93MB
- 线段树（今天介绍的版本）：4.42MB

虽然理论空间复杂度是BIT更优，但是实际上是今天介绍循环线段树碾压全场。

第二道题[P3368 「模板」树状数组2](https://www.luogu.com.cn/problem/P3368)：

代码大同小异：

```cpp
#include <cstdio>

const int N = 5e5 + 5;
int n, m, t[N << 1];

void modify(int l, int r, int v) {
    for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
        if (l & 1) t[l++] += v;
        if (r & 1) t[--r] += v;
    }
}

int queryf(int p) {
    int res = 0;
    for (p += n; p > 0; p >>= 1) res += t[p];
    return res;
}

signed main() {
    scanf("%d %d", &n, &m);
    for (int i = 0; i < n; ++i) scanf("%d", &t[i + n]);
    for (int i = 0, opt, x, y, v; i < m; ++i) {
        scanf("%d %d", &opt, &x);
        if (opt == 1) scanf("%d %d", &y, &v), modify(x - 1, y, v);
        else printf("%d\n", queryf(x - 1));
    }
    return 0;
}
```

结果比对：

- 树状数组：1.76s, 25.91MB, 1.66KB Accepted
- 线段树（今天介绍的版本）：863ms, 3.91MB, 607B Accepted

~~震惊，线段树竟在码量时间空间上都碾压了树状数组233~~

# 0x02 第二部分

直到目前为止，我们只是用线段树淦了树状数组淦的事情而已。线段树的灵魂LazyTag我们还没有涉及。那么接下来我们就来介绍循环版本的线段树如何使用LazyTag。

比如让我们维护区间加和区间极值。

先给代码：

```cpp
const int N = 5e5 + 5;
int n, m, h, t[N << 1], d[N];
```

变量解释，$n,m$ 不解释。$h$ 表示树的高度，即 $\log_{2}n$。$t$ 数组的意义是我们维护的东西。$d$ 可以理解为我们的LazyTag。之所以只用 $\Theta(n)$ 的空间是因为叶子节点不需要LazyTag，因为他们没有需要维护的子节点。

```cpp
void apply(int p, int val) {
    t[p] += val;
    if (p < n) d[p] += val;
}
```

这段是在修改的节点值，意味易得，不赘述。

```cpp
void update(int p) {
    while (p > 1) p >>= 1, t[p] = max(t[p << 1], t[p << 1 | 1]) + d[p];
}
```

这段就是在更新节点的最大值。

![uTools_1586481130160.png](https://i.loli.net/2020/04/10/6JBQi1Wg5sIf7tp.png)

以上图为例，手玩一下意味易得，下一个。

```cpp
void push(int p) {
    for (int bit = h; bit > 0; --bit) {
        int i = (p >> bit);
        if (d[i]) {
            apply(i << 1, d[i]);
            apply(i << 1 | 1, d[i]);
            d[i] = 0;
        }
    }
}
```

相当于普通线段树的pushdown。从根节点开始，如果当前的节点的LazyTag还没更新，那么就apply到子节点去，并且清掉LazyTag。

```cpp
void modify(int l, int r, int val) {
    int L = (l += n), R = (r += n);
    for (; l < r; l >>= 1, r >>= 1) {
        if (l & 1) apply(l++, val);
        if (r & 1) apply(--r, val);
    }
    return update(L), update(R - 1);
}
```

修改操作，存下叶节点的编号，更新完后update。

```cpp
int queryf(int l, int r) {
    int res = -1926081701;
    for (push((l += n)), push((r += n) - 1); l < r; l >>= 1, r >>= 1) {
        if (l & 1) res = max(res, t[l++]);
        if (r & 1) res = max(res, t[--r]);
    }
    return res;
}
```

查询，意味易得，不赘。

以下是完整的代码：

```cpp
#include <cstdio>
#include <iostream>

using std::max;

const int N = 5e5 + 5;
int n, m, h, t[N << 1], d[N];

void apply(int p, int val) {
    t[p] += val;
    if (p < n) d[p] += val;
}

void update(int p) {
    while (p > 1) p >>= 1, t[p] = max(t[p << 1], t[p << 1 | 1]) + d[p];
}

void push(int p) {
    for (int bit = h; bit > 0; --bit) {
        int i = (p >> bit);
        if (d[i]) {
            apply(i << 1, d[i]);
            apply(i << 1 | 1, d[i]);
            d[i] = 0;
        }
    }
}

void modify(int l, int r, int val) {
    int L = (l += n), R = (r += n);
    for (; l < r; l >>= 1, r >>= 1) {
        if (l & 1) apply(l++, val);
        if (r & 1) apply(--r, val);
    }
    return update(L), update(R - 1);
}

int queryf(int l, int r) {
    int res = -1926081701;
    for (push((l += n)), push((r += n) - 1); l < r; l >>= 1, r >>= 1) {
        if (l & 1) res = max(res, t[l++]);
        if (r & 1) res = max(res, t[--r]);
    }
    return res;
}

signed main() {
    scanf("%d %d", &n, &m);
    h = sizeof(int) * 8 - __builtin_clz(n);
    for (int i = 0; i < n; ++i) scanf("%d", &t[i + n]);
    for (int i = 0, opt, x, y, v; i < m; ++i) {
        scanf("%d %d %d", &opt, &x, &y);
        if (opt == 1) scanf("%d", &v), modify(x - 1, y, v);
        else printf("%d\n", queryf(x - 1, y));
    }
    return 0;
}
```

# 0x03 结尾

基于循环的线段树较于基于递归的线段树常数更小，实现更简单，对初学者更友好。而且也支持LazyTag。

较于树状数组能淦的事情更多而且经常在空间时间码量暴捶BIT……当然也可能是我打的BIT太丑了。

最主要的就是，不容易打错。像我这种看家本领Splay结果每次打都要错一次splay和rotate的手残来说，简直不要太友好。而且很好理解。

可以发现我的代码和原作者的代码很像。其实这是因为我很喜欢原作者的码风，所以写着写着就差不多啦~/xyx

留个作业吧2333，线段树模板1、2，有人写的话交评论区罢（

![](https://cdn.jsdelivr.net/gh/BoringHacker/cdn/emojis/majsoul/maj-52.png)