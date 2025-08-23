---
date: 2022-07-11
title: 基础数论再理解
category: notes
tags: [number-theory]
---


前置容斥原理，最精简的形式应当如此写成：

> 有 $n$ 个集合 $A_1, \dots, A_n$，记 $S = \{A_1, \dots, A_n\}$。
>
> 则有 $\displaystyle\left|\bigcup_{i = 1}^n A_i\right|=\sum_{T\in2^{S}}(-1)^{|T|-1}\left|\bigcap_{X\in T}X\right|$。

考察欧拉函数通项公式，不妨从容斥的角度来理解：

> 欲证明 $\displaystyle\varphi(n) = n\prod_{i=1}^{k}\left(1-\frac{1}{p_i}\right)$。
>
> **P.f.**：令 $A_i$ 表示 $p_i$ 的倍数集合（共 $k$ 个这样的集合），并且这些倍数 $\leqslant n$，$S = \{A_1, \dots, A_k\}$，可知 $\left|A_i\right| = \lfloor\frac{n}{p_i}\rfloor$。则 $\displaystyle\varphi(n) = n-\left|\bigcup_{i=1}^k A_i\right|=n-\sum_{T\in2^{S}}(-1)^{|T|-1}\left|\bigcap_{X\in T}X\right|=n-\sum_{T\in2^{S}}(-1)^{|T|-1}\frac{n}{\prod p}=n-\left(\sum_{i=1}^k\frac{n}{p_i}\right)+\left(\sum_{i=1}^k\sum_{j=i+1}^{k}\frac{n}{p_ip_j}\right)-\cdots=n
\left(1-\left(\sum_{i=1}^k\frac{1}{p_i}\right)+\left(\sum_{i=1}^k\sum_{j=i+1}^{k}\frac{1}{p_ip_j}\right)-\cdots\right) = n\prod_{i=1}^k\left(1-\frac{1}{p_i}\right)$。

解释一下推导的最后一步，考虑组合意义，r.h.s. 相当于在多项式凑系数，$1$ 表示不选，$\frac{1}{p}$ 表示选，选奇数个符号为负，选偶数个符号为正恰好对应 l.h.s.（我觉得能从左边推到右边还是比较困难的）。

从积性的角度：

> **P.f.**：易证 $\varphi(p^\alpha)=p^\alpha-p^{\alpha-1}$（考虑按 $[1,\dots p], [p+1, \dots, 2p], \dots, [p^{\alpha-1}+1, p^\alpha]$ 分组，发现只有每组的最后一个数 $\not\perp p^\alpha$，而这样的组一共有 $p^{\alpha-1}$），那么 $\displaystyle\varphi(n) = \prod_{i=1}^k\varphi(p_i^{\alpha_{i}}) = \prod_{i=1}^k\left(p_i^{\alpha_{i}}-p_i^{\alpha_i-1}\right)=n\prod_{i=1}^k\left(1-\frac{1}{p_i}\right)$。

结合以上两种证明可以顺便证明欧拉函数的积性。

---

写出 CRT 所解决的线性同余方程组问题：

> 求解方程 $x\equiv a_i\pmod{p_i}$。
>
> **Sol.**：考虑构造

咕咕咕

---

类欧几里得。

> 给定非负整数 $n,a,b,c$，求 $f(n, a, b, c) = \displaystyle\sum_{i=1}^n\lfloor\frac{ai+b}{c}\rfloor$
>
> **Sol. pt 1**：首先若 $a\geqslant c$，或 $b\geqslant c$ 我们可以通过对取模并提前计算贡献的方式将 $a<c$，$b<c$ 的假设一般化。于是不妨设 $a<c$，$b<c$，设 $m=\lfloor\frac{an+b}{c}\rfloor$，也就是求和项中的最大值（非负整数），由于 $\displaystyle\forall x\in\mathbb{N},x=\sum_{i=1}^{+\infty}[i \leqslant x]$，所以原式等于 $\displaystyle\sum_{i=1}^n\sum_{j=1}^{m}[j \leqslant \lfloor \frac{ai+b}{c} \rfloor]=\sum_{j=1}^m \sum_{i=1}^n [ai \geqslant cj-b]=nm-\sum_{j=1}^m \sum_{i=1}^n [ai \leqslant cj-b-1]=nm-\sum_{j=1}^m \sum_{i=1}^n [i \leqslant \lfloor\frac{cj-b-1}{a}\rfloor] = nm-f(m, c, -b-1, a)$，到这里你会发现有点不对头，我应该要保证 $-b-1$ 是非负整数，但是这不太可能，考虑到 $b$ 这个位置贡献的方式，我们也许需要考虑更改 $f$ 的定义。
>
> **Sol. pt 2**：更改定义 $f(n, a, b, c) = \displaystyle\sum_{i=\color{red}0}^n\lfloor\frac{ai+b}{c}\rfloor$，推导过程大体相同（有些细节可以参看 $g$，$h$ 的推导），最终的结论是 $f(n, a, b, c) = nm-f(m-1, c, c-b-1, a)$，这保证了非负整数的前提（注意边界条件的计算有所改变）。

让我们定义 $\displaystyle s_k(n) = \sum_{i=1}^n i^k$。

大致代码长这样：

```cpp
int floor_sum(LL n, int a, int b, int c) {
    // @returns: \sum_{i=0}^n floor((ai+b)/c)
    if (a == 0) {
        return mul(safe_mod(n+1), safe_mod(b/c));
    }
    if (a >= c || b >= c) {
        return add(floor_sum(n, a%c, b%c, c), mul(s(n), safe_mod(a/c)), mul(safe_mod(n+1), safe_mod(b/c)));
    }
    LL m = (a*n+b)/c;
    return sub(mul(safe_mod(n), safe_mod(m)), floor_sum(m-1, c, c-b-1, a));
}
```

> 给定非负整数 $n, a, b, c$，求 $g(n, a, b, c) = \sum_{i=0}^n \lfloor\frac{ai+b}{c}\rfloor^2$，$h(n, a, b, c) = \sum_{i=0}^n i\lfloor \frac{ai+b}{c} \rfloor$
>
> __Sol.__：汲取先前的教训，我们将 $0$ 囊括进了和式。同时在看了题解推导的过程后，我们可以更加成熟地对问题进行分类讨论。
>
> - $g$
>   - $c \leqslant \max\{a, b\}$：$\displaystyle g(n, a, b, c) = \sum_{i=0}^n \left( \lfloor\frac{(a\bmod c)i+b\bmod c}{c}+i \lfloor \frac{a}{c} \rfloor+\lfloor \frac{b}{c} \rfloor \rfloor \right)^2 = g(n, a \bmod c, b \bmod c, c)+2\lfloor \frac{a}{c} \rfloor h(n, a\bmod c, b \bmod c, c) + 2 \lfloor \frac{b}{c} \rfloor f(n, a \bmod c, b \bmod c, c) + s_2(n)\lfloor \frac{a}{c} \rfloor ^ 2  +  n(n+1)\lfloor \frac{a}{c} \rfloor \lfloor \frac{b}{c} \rfloor + (n+1)\lfloor \frac{b}{c} \rfloor ^ 2$。
>
>   - $c > \min\{a, b\}$：首先注意到 $x^2 = x(x+1)-x = 2s_1(x) - x$，令 $m=\lfloor \frac{an
>+b}{c} \rfloor$，因此 $\displaystyle g(n, a, b, c) = \sum_{i=0}^n \lfloor \frac{ai+b}{c}^2 \rfloor = 2\left(\sum_{i=0}^n \sum_{j=1}^{\lfloor \frac{ai+b}{c} \rfloor}j\right)-\left(\sum_{i=0}^n\lfloor \frac{ai+b}{c} \rfloor\right) = 2\left(\sum_{i=0}^n\sum_{j=0}^{m-1
} (j+1)[j < \lceil \frac{ai+b-c+1}{c} \rceil]\right) - f(n, a, b, c) = 2\left(\sum_{j=0}^{m-1
} (j+1) \sum_{i=0}^n [i > \lfloor \frac{cj-b+c-1}{a} \rfloor]\right) - f(n, a, b, c) = 2\left(\sum_{j=0}^{m-1
} (j+1) \left(n - \lfloor \frac{cj-b+c-1}{a} \rfloor\right)\right) - f(n, a, b, c) = 2n\times s_1(m) - 2h(m-1, c, c-b-1, a) - 2f(m-1, c, c-b-1, a) - f(n, a, b, c)$。
>
> - $h$
>   - $c \leqslant \max\{a, b\}$：$h(n, a, b, c) = h(n, a \bmod c, b \bmod c, c) + s_1(n) \lfloor \frac{b}{c} \rfloor + s_2(n) \lfloor \frac{a}{c} \rfloor$。
>   - $c > \min\{a, b\}$：$\displaystyle h(n, a, b, c) = \sum_{i=0}^n i\lfloor \frac{ai+b}{c} \rfloor = \sum_{i=0}^ni\sum_{j=0}^{m-1}[cj < ai+b-c+1] = \sum_{j=0}^{m-1}\sum_{i=0}^ni[i > \lfloor \frac{cj+c-b-1}{a} \rfloor] = \sum_{j=0}^{m-1}\left(s_1(n)-\sum_{i=0}^n i[i \leqslant \lfloor \frac{cj+c-b-1}{a} \rfloor]\right) = \sum_{j=0}^{m-1} s_1(n)-s_1(\lfloor \frac{cj+c-b-1}{a} \rfloor) = m\times s_1(n)-\frac{\sum_{j=0}^{m-1}\left(\lfloor \frac{cj+c-b-1}{a} \rfloor^2+\lfloor \frac{cj+c-b-1}{a} \rfloor\right)}{2} = s_1(n)\times m - f(m-1, c, c-b-1, a) - g(m-1, c, c-b-1, a)$。

考试给👴遇到了就下地狱吧。

最后的代码还是有点说头，很诡秘的是，用函数式取模会 T 飞，三个函数一起写会 Wa，反正最后的结局就是 `modint`+抄代码。

```cpp
tpl floor_sum(LL n, int a, int b, int c) {
    if (a == 0) {
        return {mi(n+1)*(b/c), mi(n+1)*sqr(b/c), s(n)*(b/c)};
    }
    if (a >= c || b >= c) {
        tpl ret = floor_sum(n, a%c, b%c, c);
        return {
            ret.f+s(n)*(a/c)+mi(n+1)*(b/c),
            ret.g+mi(2)*(a/c)*ret.h+mi(2)*(b/c)*ret.f+s2(n)*sqr(a/c)+mi(2)*s(n)*(a/c)*(b/c)+mi(n+1)*sqr(b/c),
            ret.h+s(n)*(b/c)+s2(n)*(a/c)
        };
    }
    LL m = (a*n+b)/c;
    tpl ret = floor_sum(m-1, c, c-b-1, a);
    return {
        mi(n)*m-ret.f,
        mi(2)*n*s(m)-2*ret.h-2*ret.f-(mi(n)*m-ret.f),
        s(n)*m-ret.f*iv2-ret.g*iv2
    };
}
```

---

阶，原根，还有，，？

学数论，就好比吃shit。吃shit啊吃shit



> **阶 multiplicative order**：在 $(a, m) = 1$ 的情况下，极小的满足 $a ^ n \equiv 1 \pmod m$ 的正整数 $n$ 称作 $a$ 模 $m$ 的阶，记作 $\delta_m(a)$。
>
> 由于欧拉定理，所以阶一定存在（至少有一个 $\varphi(m)$）。接下来扯几个性质：
> - $\{1, a^2, \dots, a^{\delta_m(a)}-1\}$ 是模 $m$ 的缩系。
> - 
    