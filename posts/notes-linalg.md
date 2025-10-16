---
title: Notes on Linear Algebra
date: 2025-10-15
category: notes
tags: [maths]
---

线性代数非常有魅力.

持续更新中嘟嘟嘟嘟.....

# Miscellaneous

## A mysterious property of $2\times 2$ matrices

$$
A^2-\operatorname{tr}(A)A+\det(A)I_2=\mathbf 0
$$

or

$$
\lambda^2-\operatorname{tr}(A)\lambda+\det (A)=0
$$

That comes from the **Cayley-Hamilton theorem** that states every square matrix over a commutative ring satisfies its own characteristic equation. The characteristic polynomial of an $n\times n$ matrix $A$ is defined as $p_A(\lambda) = \det(\lambda I_n -A)$, where $\lambda$ is a **scalar** of the base ring.

Each entry in $\lambda I_n-A$ is **either zero or linear to $\lambda$**. Therefore, $p_A(\lambda$) is a monic polynomial of $\lambda$:

$$
p_A(\lambda) = \lambda^n+\sum c_i \lambda^i
$$

The Cayley-Hamilton theorem states that

$$
p_A(A)=0
$$

One use for the theorem is that it allows $A^n$ to be expressed as a linear combination of the lower matrix powers of $A$:

$$
A^n = -\sum c_iA^i
$$
Also, it is noteatble that the roots of $p_A(\lambda)$ are the *eigenvalues* of $A$.

## Newton's Identites (Cont'd)

Define elementary symmetric polynomial $e_k(x_1,\dots,x_n)$ as:
$$
e_k(x_1,\dots,x_n)=\sum_{1\leqslant i_1<\dots<i_k\leqslant n}x_{i_1}\cdots x_{i_k}
$$
and $\displaystyle p_k(x_1,\dots,x_n)=\sum x_i^k$.

**Newton's identities**, also known as **Girard-Newton formulae**, states that
$$
ke_k(\mathbf x) = \sum_{i=1}^k (-1)^{i-1}e_{k-i}(\mathbf x)p_i(\mathbf x)
$$
**Vieta's formulas** are an example of application of Newton's identities in degree of two. The general version would be:
$$
\prod (x-x_i)=\sum (-1)^ie_i(\mathbf x)x^{n-i}
$$
