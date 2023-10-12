---
date: '2021-05-11'
title: 'Solution -「CF 1520F2」	Guess the K-th Zero (Hard version)'
category: 'Notes'
---

来个暴力点的。

首先 F1 的直接二分做 query 会吧？我们直接把同一个区间的询问 hash 一下存下来，然后加上每次 guess 后改变的值，这个可以直接用树状数组做。

然后就做完了，搜索树卡满也跑得过。

[code](https://paste.ubuntu.com/p/mShDDvh7DT/)