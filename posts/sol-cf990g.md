---
date: '2021-08-13'
title: 'Solution -「CF 990G」GCD Counting'
category: 'Notes'
---

构造函数 $ans(x)$，$f(x)$ 分别表示 $\gcd$ 为 $x$ 的链数和链 $\gcd$ 有 $x$ 因子的链数，于是 $f(x)=\sum\limits_{d\mid x}ans(d)$，由莫比乌斯反演得 $ans(x)=\sum\limits_{x|d}f(d)\mu(\frac{d}{x})$。

把每一个点权为 $x$ 的倍数的点拉出来，跑出各连通块大小可以平凡算出 $f(x)$。

但是 $ans(x)$ 的计算一定需要莫反么？

[代码给出的是容斥做法，via cqbzly。](https://paste.ubuntu.com/p/M4jTRPnC5q/)