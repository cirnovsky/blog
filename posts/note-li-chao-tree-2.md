---
date: '2022-07-14'
title: 'Note -「Li Chao Tree」2'
category: 'Notes'
---

一年前写过一篇 [note-li-chao-tree](https://www.luogu.com.cn/blog/161849/note-li-chao-tree)。现在来看，写的什么激霸。

补充一下，仅只对左右端点做判断的做法是错的，错误的原因涉及到李超树不同于普通线段树的地方。

李超树维护的是一个 lazy propagation，他把一般线段树上要维护的幺半群信息放到了函数上，所以如果只判断左右端点，是会导致标记更新不对劲。

今天 wa 了半天才意识到，，，