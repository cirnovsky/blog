---
date: '2023-11-06'
title: 'Solution Set -「杂题选」'
---

放一些并不困难，但有些启发的简单题和杂题。

### / abc 304f - Shift Table /

可以求出所有约数，记约数 $d$ 的方案数为 $f_d$，则答案为 $\displaystyle\sum_d-\mu(\frac nd)\times f_d$。为什么容斥系数是 $\mu$？