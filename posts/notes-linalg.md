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

That comes from the Cayley-Hamilton theorem that states every square matrix over a commutative ring satisfies its own characteristic equation. The characteristic polynomial of an $n\times n$ matrix $A$ is defined as $p_A(\lambda) = \det(\lambda I_n -A)$, where $\lambda$ is a **scalar** of the base ring.

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