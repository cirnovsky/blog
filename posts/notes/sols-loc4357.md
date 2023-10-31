---
date: '2023-10-25'
title: 'Solution Set -「LOC 4357」'
category: 'Notes'
---

[Link.](http://222.180.160.110:1024/contest/4357)

### A. 赢钱 (money)

人类智慧题, 好像是写成二进制小数, 每次用 Least Significant Bit 去赌? 不是很能理解...

### B. 排列 (per)

贡献可以分成五类: 环 (长度 $> 1$); 自环; 链 (长度 $> 2$); 链 (长度 $= 2$); 点. 记问题的答案为 $ans$, 一类贡献即将 $ans$ 乘 $2$, 二类贡献对 $ans$ 没有影响, 这两类都可以最后来计算, 先不管. 分别记三 / 四 / 五类贡献的数量为 $a$ / $b$ / $c$, 接下来进行分析.

这总共 $a+b+c$ 个元素对答案贡献是: 任意分组, 将组内元素拼成环的方案数之和之积. 但注意, 三类贡献由于自身可以反转, 因此要 $\times 2$, 这部分也放到最后来考虑, 而五类贡献不需要, 四类贡献最特殊, 它在自成一组的情况下不需要 $\times 2$, 否则需要. 考虑二项式反演, 设 $g_i$ 为至少有 $i$ 个四类元素自成一组的答案 (**不考虑**四类贡献的 $\times 2$ [^1]), $f_i$ 为恰好 (**考虑**四类贡献的 $\times 2$). 则由二项式反演, 有:

$$
f_i = 2^{b-i}\sum_{j=i}^b (-1)^{j-i}\binom ji g_j
$$

考虑 $g_i$ 的求法, 有:

$$
g_i = \binom bi (a+b+c-i)!
$$

为什么后面那部分是阶乘? 考虑已经加入了 $1 \sim i-1$, 现在加入 $i$, 它只能接在某个元素的后面, 或者自成一组, 一共 $i$ 种方案, 乘起来就是阶乘.

则:

$$
\begin{aligned}
&\sum f_i \\
=&~2^{b-i}\sum_{i=0}^b\sum_{j=i}^b(-1)^{j-i}\binom ji g_j \\
=&~2^b\sum_{j=0}^bg_j\sum_{i=0}^j\left(\frac 12\right)^i(-1)^{j-i}\binom ji \\
=&~2^b\sum_{j=0}^bg_j \left(-\frac 12\right)^j
\end{aligned}
$$

 直接计算即可. 说起来比较麻烦, 其实还是比较简单的, 应该是真正的签到题.

### C. 箱子 (box)

贪心策略就是选择极长区间操作, 证明可以考虑贡献形式是求和, 因此操作区间不会相交, 只会包含或无交. 于是用线段树维护左右端点的信息, 区间的答案, 区间如果全部同色的答案 (为了区间覆盖操作) 即可.

### D. 排列 (permutation)

学了下高一同学的模拟退火.

[^1]: 为什么不考虑? 如果在 $g_i$ 的阶段就计算了, 后面就无法套用二项式定理优化复杂度了.

---

> / <span style="font-variant:small-caps;">When</span> thy inconsiderate hand /
>
> / Flings ope this casement, with my trembling name, /
>
> / To look on one, whose wit or land, /
>
> / New battery to thy heart may frame, /
>
> / Then think this name alive, and that thou thus /
>
> / In it offend’st my Genius./
>
> —— [John Donne - *A Valediction of My Name in the Window*]()