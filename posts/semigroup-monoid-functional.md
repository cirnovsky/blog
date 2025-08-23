---
date: 2022-03-22
title: 「Semigroup と Monoid と Functional と」
category: notes
tags: [group-theory,maths]
---

一个被国内 oi 环境弱化至几乎不存在的概念，不过我觉得还是有学一学的必要。因为我没学过代数结构所以大部分内容都在开黄腔，欲喷从轻。

Semigroup 的定义是，$\forall a,b\in\mathbb{S}$，有 $a\cdot b\in\mathbb{S}$ 并且 $(a\cdot b)\cdot c=a\cdot(b\cdot c)$，则称 $\lang\mathbb{S},\cdot\rang$ 为一个 semigroup，称其中的二元运算 $\cdot:\mathbb{S}\cdot\mathbb{S}\rightarrow\mathbb{S}$ 为半群的乘法。

Semigroup 与 group 的区别在于有无幺（identity element），并且所有元素均有逆。

Monoid 则是在 semigroup 的基础上添加了一个幺，翻译过来即幺半群。

有了这些理论支撑，我们在解决一系列数据结构问题时的思维将得到~~几乎为零的~~简化
    