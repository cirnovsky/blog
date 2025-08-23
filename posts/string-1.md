---
date: 2022-07-25
title: 字符串 1
category: notes
tags: [strings,suffix-structures]
---

#### 学了五年 KMP

拜谢 oi-wiki。字符串下标从 $0$ 开始，$s_{[l, r]}$ 闭区间子串，定义 $\displaystyle \pi_i = \max_{j \in [0, i]} j[s_{[0, j-1] = s_{[i-j+1, i]}}]$。规定 $\pi_0 = 0$。

朴素求 border 有一个小优化，可以把复杂度从 $O(n^3)$ 降成 $O(n^2)$，这里直接蒯份 oi-wiki 的代码：

```cpp
// C++ Version
vector<int> prefix_function(string s) {
  int n = (int)s.length();
  vector<int> pi(n);
  for (int i = 1; i < n; i++)
    for (int j = pi[i - 1] + 1; j >= 0; j--)  // improved: j=i => j=pi[i-1]+1
      if (s.substr(0, j) == s.substr(i - j + 1, j)) {
        pi[i] = j;
        break;
      }
  return pi;
}
```

复杂度 $O\left(\left(\sum \pi_i-\pi_{i-1}\right)\times T\right) = O(\pi_{n-1}\times T) = O(n \times T)$，其中 $T$ 是字符串比较的复杂度。

注意到 border 每次至多增长 $1$（我们考虑从 $i-1$ 转移到 $i$），且增长的充要条件是 $s_i = s_{\pi_{i-1}}$。如果不能增长，我们就考虑一种「递归子问题」式的处理方法，即令 $S$ 为「所有出现在 $\pi_{i-1}$ 决策链中的下标集合」，也就是 $\pi$ 定义的那个 $\max$ 里面并且后面的 iversion brackets 为真的 $j$，并且记 $S$ 中的最大值为 $j^{(0)}$，次大值为 $j^{(1)}$，以此类推。又注意到 $s_{0, j-1} = s_{[i-j+1, i]} = s_{\pi_i-j, \pi_i-1}$（$\overbrace{\underbrace{s_0 ~ s_1}_j ~ s_2 ~ s_3}^{\pi[i]} ~ \dots ~ \overbrace{s_{i-3} ~ s_{i-2} ~ \underbrace{s_{i-1} ~ s_{i}}_j}^{\pi[i]} ~ s_{i+1}$），所以得到 $j^{(n)} = \pi_{j^{(n-1)}-1}$。

```cpp
for (int i=1,j; i<n; ++i) {
    for (j = brd[i-1]; j && s[i] != s[j];) {
        j = brd[j-1];
    }
    brd[i] = j+(s[i] == s[j]);
}
```

考虑复杂度，即证明我们只会跳 $O(n)$ 次的 border。我记得我两年前证过，好像用到了字符集大小远小于字符串规模的前提。不管了。我他吗不证了。

#### Trie，爱你

Trie 的空间复杂度实际上是需要均摊证明是 $O(n\times\Sigma)$ 的，其中 $n$ 是所有字符串的总长。

#### Aho-Corasick DFA

非常喜欢 ouuan 对一些事情的看法与做法，学习应该更贴切于本质而不是功利主义渲染下的作用与价值。

我们需要了解 DFA 是什么。DFA 是一个被描述为 $(\Sigma, Q, start, F, \delta)$ 的五元组：

><li><strong>字符集</strong>（$\Sigma$），该自动机只能输入这些字符。</li>
><li><strong>状态集合</strong>（$Q$）。如果把一个DFA看成一张有向图，那么 DFA 中的状态就相当于图上的顶点。</li>
><li><strong>起始状态</strong>（$start$），$start\in Q$，是一个特殊的状态。起始状态一般用 $s$ 表示，为了避免混淆，本文中使用 $start$。</li>
><li><strong>接受状态集合</strong>（$F$），$F\subseteq Q$，是一堆特殊的状态。</li>
><li><strong>转移函数</strong>（$\delta$），$\delta$ 是一个接受两个参数返回一个值的函数，其中第一个参数和返回值都是一个状态，第二个参数是字符集中的一个字符。如果把一个DFA看成一张有向图，那么 DFA 中的转移函数就相当于顶点间的边，而每条边上都有一个字符。</li>
><p align="right">—— ouuan</p>

我们先来看 KMP 中的狭义 AC DFA 结构（事实上 KMP 本身即是一个 DFA，不过主体是一条链而已），其失配指针指向当前前缀的最长真后缀构成的字符串在哪个前缀。

所以说 oi-wiki 上将对于失配指针的描述改成长度实际上是不太传统的，但也不影响 oi-wiki 写得非常好。

AC DFA 已经更好理解了，无非是把 border 的定义从链上搬到了 trie 树上。

#### 字符串匹配

我们需要考虑 border 的存在会为字符串匹配产生怎样的影响，传统的朴素做法是以模式串为主元，通过挪动模式串的头指针在文本串中的位置做匹配。当 $[j, m) \neq [i, i+m-j-1]$，也就是说 $[i-j, i)=[0,j)$，然后我舍弃 $[\delta(j-1)+1, j)$ 的匹配长度，再尝试 $j$ 和 $i$。换言之，我想要求到的是**以 $i$ 结尾的最长匹配长度**。这就是匹配。

总结地说，我们使用失配指针优化匹配的过程，实际上是在找**原串中每个前缀的最长后缀，满足这个后缀是模式串的一个前缀**，这样看，失配指针的构造就非常自然了。

转而看到 AC DFA 上，当你在 DFA 上的转移不能继续进行时，就会跳到失配指针上，使得你的决策变得更劣（因为不存在不劣的决策，可以理解为一个小贪心吧）。

#### 其他

Q：为什么 AC DFA 上搞事情每个结点**可能**要继承其失配指针的信息？

A：因为这说明当前结点存在一个极长真后缀是所以插入模式串中的一个。
    