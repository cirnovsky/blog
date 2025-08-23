---
date: 2021-04-03
title: Solution -「CF 392C」Yet Another Number Sequence
category: notes
tags: [maths]
---

## Description

[Link](http://codeforces.com/problemset/problem/392/C).

求 $\sum_{i=1}^{n}\text{fibonacci}_{i}\times i^{k}=\sum_{i=1}^{n}(F_{i-1}+\text{fibonacci}_{i-2})\times i^{k}$，$1\le n\le10^{17},1\le k\le40$。

## Solution

简记 $F_{i}=\text{fibonacci}_{i}$。首先我们作个差：

$$
ans_{n}=\sum_{i=1}^{n}F_{i}\times i^{k}=\sum_{i=1}^{n}(F_{i-1}+F_{i-2})\times i^{k} \\
ans_{n}-ans_{n-1}=F_{n}\times n^{k} \\
$$

然后：

$$
\begin{aligned}
ans_{n}&=ans_{n-1}+F_{n}\times n^{k} \\
&=ans_{n-1}+F_{n-1}\times(n-1+1)^{k}+F_{n-2}\times(n-2+2)^{k} \\
&=ans_{n-1}+\left(\sum_{i=0}^{k}A_{i-1}(i)\times\binom{k}{i}\right)+\left(\sum_{i=0}^{k}A_{i-2}(i)\times\binom{k}{i}\times2^{k-i} \right)
\end{aligned}
$$

后面的 dirty work 实在不想做，口胡选手选择放弃。

```cpp
Oops, something went wrong.
```
    