---
date: '2020-01-13'
title: 'Note -「Möbius Inversion」'
category: 'Notes'
---

定义数论函数

$$
\mu(d)=\begin{cases} 1,d=1\\
\displaystyle\\
\displaystyle(-1)^k,\prod_{i=1}^{k}p_i \\
\displaystyle0, d\ne 1\ and\ d\ne \prod_{i=1}^{k}pi \end{cases}
$$

其中$p_i$为互不相同的质数

即当自变量$d$等于1时，函数值为1，当自变量$d$不等于1且没有*重复* 的质因子时，函数值为$(-1)^{C_d}$，其中$C_d$为$d$的质因子数量，否则函数值为0.

不难得出莫比乌斯函数是一个积性函数

证明如下：

-----

记$a\in N$，$b\in N$

当$\mu(a)=0$或$\mu(b)=0$

即$a$有重复的质因子或$b$有重复的质因子

显然，$a\times b$也有重复的质因子

所以$\mu(ab)=\mu(a)\times\mu(b)=0$

当$a=1$或$b=1$

显然有$\mu(a)\times\mu(b)=\mu(ab)$

否则，记$K_a$为$a$的质因子个数，$K_b$为$b$的质因子个数

$\mu(a)\times\mu(b)=(-1)^{K_a+K_b}$

$a\times b$有$K_a+K_b$个质因子

所以$\mu(ab)=(-1)^{K_a+K_b}$

所以$\mu(ab)=\mu(a)\times\mu(b)$

综上所述，$\mu(ab)=\mu(a)\times\mu(b)$即莫比乌斯函数满足积性

-----

我的证明方法或许不是最简洁的，但一定是最好理解的~~试图掩饰菜鸡的事实~~

