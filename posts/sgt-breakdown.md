---
date: 2021-08-25
title: Segment Tree in a Mathematic Way
category: notes
tags: [data-structures]
---

没想到吧。

其实本文旨在以 **object oriented** 的方式工程化地描述线段树的抽象结构，大概是在翻译 ACL 的 `lazysegtree`。

在线段树上的结点中，有两种信息，分别称为 `S`，`F`，一个是维护的信息，一个是懒惰标记，又对应两个「空值」`e()` 和 `id()`。

线段树依赖于两个儿子的值是 `S`，依赖于父亲的值是 `F`，定义一个函数 `op(x, y)`，其中 $x,y\in\mathbb{S}$ 表示 $x,y$ 合并的结果，这个规则是自定义的，且需要满足结合律和交换律；以及 `composition(x, y)`，其中 $x,y\in\mathbb{F}$，表示把懒惰标记 $x$ **单向**传递到懒惰标记 $y$ 上后的结果，其规则同样是自定义的。如果不理解为什么是单向请参考 *Range Affine, Range Sum* 问题。

类似于 `composition(x, y)` 使得可以让一个在 $\mathbb{F}$ 中的元素传递到另一个属于 $\mathbb{F}$ 的元素身上，我们有 `mapping(x, y)` 表示从 $\mathbb{F}$ 到 $\mathbb{S}$ 的映射，其中 $x\in\mathbb{F}$，$y\in\mathbb{S}$。

其实可以发现所谓的 `S` 就是一类**幺半群**（monoid），注意 `F` 显然不具有此类性质，但是 `F` 的 `composition(x, y)` 是有**封闭性**的。

[例题 P3373，](https://www.luogu.com.cn/problem/P3373)[示例代码见此处，特征码 acl-k。](https://www.cnblogs.com/orchid-any/articles/15153763.html)

闲话，如果你的代码实现真的分这么细码量会激增哦。（
    