---
date: '2023-01-18'
title: 'Note -「Taylor Expansion & Polynomial Operations」'
category: 'Notes'
---

Hi，各位……

两个多月没动过笔了，这期间我跟退役了一样

但是谁知道呢，答案在风中飘荡

---

多项式运算的一般形式可以写成解 $f(\mathbf u,\textbf v)\equiv0 \pmod {x^n}$ 的方程（在取模意义下研究主要是很多多项式算子会导出无穷项的结果……），其中 $\mathbf u$、$\mathbf v$ 代表两个多项式。先研究 $n=1$ 时的情况，即解方程 $f(\mathbf u,\mathbf v)\equiv0\pmod x$，这意味着取出常数项并解一个实方程。由这个结果拓展到一般，令 $\mathbf u_n$ 表示 $f(\mathbf u,\mathbf v)\equiv 0\pmod {x^{2^{n}}}$ 的解，则接下来的问题成了求解 $\mathbf u_n$ 到 $\mathbf u_{n+1}$ 的关系式。

把 $f(\mathbf u_{n+1},\mathbf v)$ 在 $(\mathbf u_n,\mathbf v)$ 处施加泰勒展开，有 $\displaystyle f(\mathbf u_{n+1},v)=\sum_{i=0}\frac{1}{i!}f_{\mathbf u_{i}}(\mathbf u_n,\mathbf v)(\mathbf u_{n+1}-\mathbf u_n)^i$。由于 $x^{2^n} \mid \mathbf u_{n+1}-\mathbf u_n$，所以 $f(\mathbf u_{n+1},\mathbf v)=f(\mathbf u_n,v)+f_{\mathbf u}(\mathbf u_n,\mathbf v)(\mathbf u_{n+1}-\mathbf u_n)\equiv 0 \pmod {x^{2^{n+1}}}$，则 $\mathbf u_{n+1}=\mathbf u_n-\frac{f(\mathbf u_n,\mathbf v)}{f_{\mathbf u}(\mathbf u,\mathbf v)}$。

实际解题的步骤就是聪明地定义好 $f$ 后套上结论得到可以运算的递推式啦。