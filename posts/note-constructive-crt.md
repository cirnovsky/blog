---
date: '2021-08-21'
title: "Note -「The Construction of Chinese Remainer Theorem」"
category: 'Notes'
---

原来的标题是：『「水」CRT 的构造本质』。

对于一个单元线性同余方程组 $x\equiv a_i\pmod{r_i}$，考虑构造一个 $\{c_i\}$ 使得 $\forall i\neq j$，有 $c_i\equiv0\pmod{r_j}$，且 $c_i\equiv1\pmod{r_i}$，那么一定存在解 $x\equiv\sum a_ic_i\pmod{\prod r_i}$。

给出一种构造方法：令 $m_i=\frac{\prod r_i}{r_i}$，则 $c_i\equiv m_i\times m_i^{-1}$，其中 $m_i^{-1}$ 是 $m_i$ 模 $r_i$ 的乘法逆元（但运算结果不作取模），显然满足上述性质，这就是 ***C**hinese **R**emainder **T**heorem* 的构造本质。