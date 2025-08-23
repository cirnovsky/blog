---
date: 2022-08-05
title: 千年食谱颂
category: notes
tags: [nag]
---

我不是电子越共，而且这个东西也不小众。

> Mistakes That I Don't Want to Make Once Again.

// Caution //

1. 差分 / 前缀和后注意询问区间端点有变化……

2. 不要考虑了右边界就不考虑左边界

// Caution //

1. 只减不加莫队如果维护了数据结构, 换块的时候要将前缀块 (处理过的) 的影响消除. 一个高庙的写法是开个 stack 记录修改, 然后将换块的左指针挪动的 stack 清了. *at - rrads*

2. 只加不减应该也有类似的问题.

// Caution //

李超树动态开点时，当前结点为空应该直接赋值后退出，即：

```cpp
int upd(int id, int u, int l = -vinf, int r = vinf) {
    if (!u) return tr[u = ++tid] = id, u;
```

// Caution //

决策单调性的题目，如果贡献与之前的 dp 值有关，就不能写整体二分了，不然会出现「第一个求的是 `dp[mid]`」这样转移顺序的问题，比如诗人小狗。
    