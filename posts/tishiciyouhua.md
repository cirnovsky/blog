---
date: 2026-07-02
title: "提示词优化"
category: notes
tags: [technical]
---

## GEPA

I really thought it was interesting. Shame that I couldn't deliver it clearly to my colleagues. Although I'm pretty sure some of them managed to make sense out of it.

Regarding XC's question, yes, GEPA's definition of Pareto Front is unconventional. A set like $\{[1, 0], [0, 1], [0.5, 0.5]\}$ is legal Pareto front but in GEPA $[0.5, 0.5]$ will not be in the Pareto front since it's not top-performing in any dimensions.

I'd like to correct myself by pointing out, the nodes on the genetic tree of GEPA is a **set** of prompts instead of a monolithic prompt. GEPA is built for compound AI system, so there are multiple language modules (a good analogy would be sub-agents).

GEPA maintains a candidate pool which is a genetic tree. In each round of evolution, we choose one node to mutate. The node is chosen stochastically from a subset of the tree. The subset is Pareto optima.

Later a minibatch evaluation would be run on the mutated new candidate, if it improved on mean score, it will be added to the candidate pool aka the genetic tree, as a descendant of the node it mutated from.

Now comes to merging. The just-as-interesting part.

Merging is in the same position as mutating. Instead of choosing ONE node from the PARETO FRONT, it chooses two nodes from the Pareto optimal subset of the entire tree [^1], stochastically. They merge module-by-module, trying to get the complementary combination out of the node sets of prompts. In the paper they adopted a metric (to evaluate which node's got the desired module mutation) that involves common ancestors.

The merging mechanism leaves me puzzled with some questions.

1. In two compound AI system, each having language modules exceptional in different field of missions, how to combine them so they result in the better?
2. GEPA discussed two way merging. Will k-way merging ever be valuable?

[^1] They claimed so, yet the pseudo code didn't reflect appearing-to-be Pareto check.
