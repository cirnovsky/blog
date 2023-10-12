---
date: '2021-08-06'
title: 'Solution -「AGC 005D」~K Perm Counting'
category: 'Notes'
---

做一步容斥让 $\forall i,|p(i)-i|\neq k$ 的限制弱化成大于等于，即设 $f(x)$ 为排列中至少有 $x$ 个索引 $i$ 满足 $|p(i)-i|=k$ 的方案数，答案即 $\sum\limits_{i=0}^n(-1)^if(i)$。接下来考虑如何求解 $f(x)$。

若根据一些置换群（当然和这题没关系）的套路把 $i\rightarrow p(i)$ 的边连出来，你会发现这里面是一些链。

不妨把链拍在一个序列上，设 $g(i,j,1/0)$ 表示前 $i$ 个点，连了 $j$ 条边，第 $i$ 个点和第 $i-1$ 个点是否连边的方案数，转移显然。

于是答案即 $\sum\limits_{i=0}^n(-1)^i(g(2n,i,0)+g(2n,i,1))(n-i)!$，意义可见。