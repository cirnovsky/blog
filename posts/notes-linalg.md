---
title: Notes on Linear Algebra
date: 2025-10-15
category: notes
tags: [maths]
---

# Adjoint Matrix

I'd like to go through some identities, properties, and proofs.

1. $\det(\operatorname{adj}(A)) = (\det(A))^{n-1}$

    Use $A \operatorname{adj}(A) = \det(A) I$. Take the determinant on both sides, and we get $\det(A)\det(\operatorname{adj}(A)) = (\det(A))^n$. There you go.

2. $\operatorname{adj}(\operatorname{adj}(A)) = (\det(A))^{n-2} A$

    Use $A \operatorname{adj}(A) = \det(A) I$. let A := adj(A). there you go.

3. 

---

# Diagonalization

## Properties of Similar Matrices

If $A$ and $B$ are $n \times n$ matrices and $A \sim B$, then

1. $\det(A) = \det(B)$

    This is obvious.

2. $\operatorname{rank}(A) = \operatorname{rank}(B)$

    Consider the rank-nullity theorem, and we only need to prove that $\operatorname{null}(A) = \operatorname{null}(P^{-1} A P)$.

    If $A\mathbf{x} = \mathbf{0}$, then $A\mathbf{x} \in \ker(A)$.

    If $P^{-1} A P \mathbf{x} = \mathbf{0}$, then $A (P\mathbf{x}) = \mathbf{0}$, then $P\mathbf{x} \in \ker(A)$.

    Given that $P$ is invertible (so $\mathbf{x}$ and $P\mathbf{x}$ correspond to each other uniquely), we've hence proved that $\dim(\ker(A)) = \dim(\ker(B))$.

3. $\operatorname{tr}(A) = \operatorname{tr}(B)$

4. 

---

# Decompositions

## LU Decomposition

---

# Miscellaneous

## Projection

### Onto another vector

Define the **projection** of $\mathbf{y} \in \mathbb R^m$ onto $\mathbf{a} \in \mathbb R^m$ as:
$$
\operatorname{Proj}(\mathbf{y};\mathbf{a}) = \frac{\mathbf{a}\mathbf{a}^\top}{\mathbf{a}^\top\mathbf{a}}\mathbf{y}
$$
### Onto another column space

And the projection of $\mathbf{y}$ onto the **column space**, also known as the **range** $\mathcal R(A)$, of a matrix $A \in \mathbb R^{m\times n}$ is given by:
$$
\operatorname{Proj}(\mathbf{y};A) = \underset{\mathbf{v}\in \mathcal R(A)}{\operatorname{argmin}}\left \| \mathbf{v}-\mathbf{y} \right\| = A(A^\top A)^{-1}A^\top\mathbf{y}
$$
where $\mathcal R(A)$ is the column space of $A$.

### Connections with normal equation

Recall the normal equation:
$$
\mathbf{\hat{\theta}} = (X^\top X)^{-1}X^\top\mathbf{y}
$$
Multiply both sides with $X$:
$$
X\mathbf{\hat{\theta}} = X(X^\top X)^{-1}X^\top\mathbf{y}
$$

## A mysterious property of $2\times 2$ matrices

$$
A^2-\operatorname{tr}(A)A+\det(A)I_2=\mathbf 0
$$
or
$$
\lambda^2-\operatorname{tr}(A)\lambda+\det (A)=0
$$

That comes from the **Cayley-Hamilton theorem** that states every square matrix over a commutative ring satisfies its own characteristic equation. The characteristic polynomial of an $n\times n$ matrix $A$ is defined as $p_A(\lambda) = \det(\lambda I_n -A)$, where $\lambda$ is a **scalar** of the base ring.

Each entry in $\lambda I_n-A$ is **either zero or linear in $\lambda$**. Therefore, $p_A(\lambda)$ is a monic polynomial in $\lambda$:
$$
p_A(\lambda) = \lambda^n+\sum_{i=0}^{n-1} c_i \lambda^i
$$

The Cayley-Hamilton theorem states that
$$
p_A(A)=\mathbf{0}
$$

One use for the theorem is that it allows $A^n$ to be expressed as a linear combination of the lower matrix powers of $A$:
$$
A^n = -\sum_{i=0}^{n-1} c_iA^i
$$
Also, it is notable that the roots of $p_A(\lambda)$ are the *eigenvalues* of $A$.

## Newton's Identities (Cont'd)

Define the elementary symmetric polynomial $e_k(x_1,\dots,x_n)$ as:
$$
e_k(\mathbf x) = e_k(x_1,\dots,x_n)=\sum_{1\leqslant i_1<\dots<i_k\leqslant n}x_{i_1}\cdots x_{i_k}
$$
and $\displaystyle p_k(\mathbf x) = p_k(x_1,\dots,x_n)=\sum_{i=1}^n x_i^k$.

**Newton's identities**, also known as **Girard-Newton formulae**, states that
$$
k e_k(\mathbf x) = \sum_{i=1}^k (-1)^{i-1}e_{k-i}(\mathbf x)p_i(\mathbf x)
$$
**Vieta's formulas** are an example of the application of Newton's identities in degree two. The general version would be:
$$
\prod_{i=1}^n (x-x_i)=\sum_{i=0}^n (-1)^i e_i(\mathbf x)x^{n-i}
$$