---
title: '【笔记】LRL 矢量 / Laplace-Runge-Lenz Vector'
date: '2025-04-14'
---

# 定义

中心场问题中一个守恒量。定义：$\mathbf{A}=\mathbf{p}\times\mathbf{L}-mk\hat{\mathbf r}$，其中 $\mathbf p$ 是动量， $\mathbf L$ 是角动量，$m$ 是物体质量，$k$ 是平方反比中心场的一个参量，比如对于万有引力问题，$k = GMm$，$\hat{\mathbf r}$ 是位矢的单位。下面证明其守恒性：

# 守恒性

我们想要证明 $\dot{\mathbf A} = \mathbf 0$，也就是 $\dot{\mathbf A} = \dot{\mathbf p}\times \mathbf L - mk\dot{\hat{\mathbf r}} = \mathbf 0$。

- $\dot{\mathbf p}$：$\dot{\mathbf p} = \mathbf F = -\frac k{r^2}\hat{\mathbf r}$;
- $\dot{\hat{\mathbf r}} = \dot{\hat\theta}\hat{\mathbf\theta}$;
- $\mathbf L = \mathbf r \times m\mathbf v = m(r\hat{\mathrm r})\times(\dot r\hat{\mathbf r}+r\dot\theta\hat{\mathbf\theta})=mr^2\dot\theta\hat{\mathbf n}$.

因此
$$
\begin{align}
\dot{\mathbf A}
& = (-\frac k{r^2}\hat{\mathbf r})\times \mathbf F - mk\hat{\dot\theta}\hat\theta \\
& = -\frac k{r^2}\hat{\mathbf r}\times(mr^2\dot\theta\hat{\mathbf n})-mk\dot{\hat{\mathbf\theta}}\hat{\mathbf\theta} \\
& = -mk\dot\theta(\hat{\mathbf r}\times\hat{\mathbf n}+\hat{\mathbf\theta}) \\
& = \mathbf 0
\end{align}
$$
Q.E.D.

# 应用

目前只见过用于证明开普勒第一定律，即天体运动的相对运动轨迹为圆锥曲线，或者数学地 $r=\frac p{1+\varepsilon\cos\theta}$。具体证明考虑 $\mathbf A \cdot\mathbf r$ 即可。