---
title: Revision for Elementary Number Theory
date: 2025-09-01
category: notes
tags: [maths,number-theory]
---

*I once knew a thing or two about number theory.*

# Bézout's identity

It states that for any two integers $a$ and $b$, there exist integers $x$ and $y$ such that $ax+by=\gcd(a,b)$. This reveals that the GCD of two integers can **always** be expressed in terms of a linear combination of the two integers themselves.

>**Proof:**
>
> > **Lemma 1**: $\boxed{\gcd(a,b)=\gcd(a,b-a)}$
>
> > **Proof**: Let $d=\gcd(a,b)$ and hence $a=pd$, $b=qd$ and $b-a=(q-p)d$ where $p$ and $q$ are coprime. Therefore, $\gcd(a,b)=d\gcd(p,q)=d$ and $\gcd(a,b-a)=d\gcd(p,q-p)$.
>
> > We only need to prove that $\gcd(p,q-p)=1$ given $\gcd(p,q)=1$. Proof by contradiction. Assume $\gcd(p,q-p)=g\neq1$. Hence, $p\bmod g=0$ and $(p-q)\bmod g=0=-q\bmod g$ and therefore $g\mid\gcd(p,q)$, which contradicts with the assumption. $\blacksquare$
>
> By **Lemma 1** it can be deduced that $\gcd(a,b)=\gcd(b,a\bmod b)$.

In addition, it can be also deduced that the Diophantine equation

$$
ax+by=c
$$

has an integer solutoin **iff** $\gcd(a,b)\mid c$. The solution can be obtained by simply multiplying $x$ and $y$ by $\frac c{\gcd(a,b)}$.

# Extended Euclidean Algorithm

Start with $(x,y)=(1,0)$ which corresponds to the solution of $\gcd(a,b)x+0y=\gcd(a,b)$. Let us assume that we found the coefficients $(x_1,y_1)$ for $(b,a\bmod b)$ and see how to find $(x,y)$ for $(a,b)$. We have $a\bmod b=a-\lfloor\frac ab\rfloor b$, hence

$$
g=bx_1+(a-\lfloor\frac ab\rfloor b)y_1=ay_1+b(x_1-\lfloor\frac ab\rfloor y_1)
$$

Therefore $(x,y)=(y_1,x_1-\lfloor\frac ab\rfloor y_1)$.

```cpp
PI exgcd(ll a, ll b) {
	if (b == 0)
		return PI(1, 0);
	auto [x, y] = exgcd(b, a % b);
	return PI(y, x - (a / b) * y);
}

```

*To be continued.*