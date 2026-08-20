---
date: 2026-08-20
title: "QOJ (1, 2) Nim"
category: notes
tags: [game-theory]
---

https://qoj.ac/problem/6642

If all piles had exactly 1 stone, it'd be easy to determine the winner. Note that when `n%3 == 1`, whoever at play is bound to lose. Now let's try add `k` piles with more than 1 stone.

1. `k = 0`: Sprague would win iff `n%3==1`.
2. `k = 1`: Sprague would win iff `n%3!=2`.
3. `k = 2`: Note that regardless of Sprague's first move, Grundy would be able to move in a way such that Sprague dies. So Grundy must win.
4. `k > 2`: For the game to end, at one stage `k` would be 2, so regardless of the exact value of `k`, Grundy would win.
