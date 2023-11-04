---
date: '2022-11-19'
title: 'Solution -「GYM 102331H」Honorable Mention'

---

[link．](https://codeforces.com/gym/102331/problem/H)

单次询问的做法是平凡的，令 $f_i(k)$ 表示将前 $i$ 个元素划分出了 $k$ 段的最大值，有转移：

$$
f_i(k) = \max\{f_{i-1}(k), \max_{0 \leqslant j < i} \{f_j(k-1)+s_i-s_j\}\}
$$

其中 $s$ 是前缀和．研究函数 $g(k) = f_n(k)$，可以发现所有的 $(k, g(k))$ 构成了一个凸包，证明考虑构造一个费用流模型：

> 将所有元素 $a_i$ 分拆成 $u_i$ 与 $v_i$ 两个点，令四元组 $\lang u, v, c, w\rang$ 为费用流网络上的一条边．有：
>
> $$
> V_N = [1, n] \cup \{s, t\} \\
> E_N = \{(u_i, v_i) \mid i \in [1, n]\} \cup \{(v_i, u_{i+1}) \mid i\in [1, n)\} \cup\{(s, u_i) \mid i \in [1, n]\} \cup \{ (v_i, t) \mid i \in [1, n] \} \\
> \begin{cases}
> c(u_i, v_i) = 1, w(u_i, v_i) = a_i, i \in [1, n] \\
> c(v_i, u_{i+1}) = 1, w(v_i, u_{i+1}) = 0, i \in [1, n) \\
> c(s, u_i) = c(v_i, t) = 1, w(s, u_i) = w(v_i, t) = 0, i \in [1, n]
> \end{cases}
> $$
> 由于最大费用流每次增广的费用是递减的，因此 $g(k)$ 的斜率递减．

再考虑多次询问，我们使用线段树来维护分治的过程．具体而言，线段树上的每一个结点维护的是 $g_{[l, r]}(k)$ 表示只考虑原序列的 $[l, r]$ 这一部分的 $g(k)$．但是你注意到一个事情，$[l, m]$ 和 $(m, r]$ 这两个区间要是合并成了 $[l, r]$ 这个区间，我们需要考虑跨过中点的情况．所以线段树上的每个结点一共要维护四个凸包，分别是 $g_{[l, r]}(k, 0/1, 0/1)$，表示考虑区间 $[l, r]$ 上左右端点分别有没有被划分入某一段里面的情况．

现在我们来考虑怎么合并线段树上某个结点的两个子结点里面的四乘二等于八个凸包．注意到只有左儿子取了右端点，且右儿子取了左端点的情况合并比较特殊，其他的 15 种情况都是同理的．因为这时，左右儿子合并出来的凸包会少一段（左儿子的右端点和右儿子的左端点合并成了一段）．我们写出比较普适的另外 15 种情况（以下方程没有写出限制条件）的转移：

$$
g_{[l, r]}(i+j, 0/1, 0/1) = \max\{g_{[l, m]}(i, 0/1, 0/1)+g_{(m, r]}(j, 0/1,0/1)\}
$$

特殊情况：

$$
g_{[l, r]}(i+j-1, 0/1, 0/1) = \max\{g_{[l, m]}(i, 0/1, 0/1)+g_{(m, r]}(j, 0/1,0/1)\}
$$

这个转移怎么维护呢？看起来好像要 $O((r-l+1)^2)$ 的样子．但是如果你仔细看就会发现这是个向量加法的形式，即 $(i+j, g_3(i+j)) = (i, g_1(i))+(j, g_2(j))$，使用凸包的 Minkowski Sums 即可线性把加法做出来，再线性取一遍 max 即可．

到这里我觉得这个题已经足够傻逼了，但这混账 300iq 比我想象中更傻逼．

我们继续看怎么回答询问．考虑暴力，即把询问区间 $[L, R]$ 在线段树上拆出来的 $O(\log_2(R-L+1))$ 个子区间合并起来，直接取合并出来的凸壳的 $g(k)$ 就是答案．这样合并单次询问的复杂度必然与询问区间长度相关．

再考虑不直接合并这些凸包，采用 wqs 二分去掉各个凸包选择的段数之和必须为 $k$ 这一限制，那么每个凸包可以各自独立的贪心选择最优解（其实就是各凸包与二分给出的斜率直线切点）再加和得到答案．需要注意的是每个结点四个凸包都要考虑．$O(q \log_2^3 n)$．

考虑进一步的优化，就是平行 wqs 二分了．因为二分给出的斜率是单调的，因此各个凸包的切点变化也是单调的，使用一个指针维护而不是二分地去找可以剩一个 log．$O(q\log_2^2 n)$．

我不知道怎样的冤种会去写这种答辩．