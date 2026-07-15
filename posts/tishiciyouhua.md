---
date: 2026-07-02
title: "提示词优化"
category: notes
tags: [technical]
---

## GEPA

I really thought it was interesting. Shame that I couldn't deliver it clearly to my colleagues. Although I'm pretty sure some of them managed to make sense out of it.

Regarding XC's question, yes, GEPA's definition of Pareto Front is unconventional. A set like $\\{[1, 0], [0, 1], [0.5, 0.5]\\}$ is legal Pareto front but in GEPA $[0.5, 0.5]$ will not be in the Pareto front since it's not top-performing in any dimensions.

I'd like to correct myself by pointing out, the nodes on the genetic tree of GEPA are **sets** of prompts instead of monolithic prompts. GEPA is built for compound AI system, so there are multiple language modules (a good analogy would be sub-agents).

GEPA maintains a candidate pool which is a genetic tree. In each round of evolution, we choose one node to mutate. The node is chosen stochastically from a subset of the tree. The subset is Pareto optima.

Later a minibatch evaluation would be run on the mutated new candidate, if it improved on mean score, it will be added to the candidate pool aka the genetic tree, as a descendant of the node it mutated from.

Now comes to merging. The just-as-interesting part.

Merging is in the same position as mutating. Instead of choosing ONE node from the PARETO FRONT, it chooses two nodes from the Pareto optimal [^1] subset of the entire tree, stochastically. They merge module-by-module, trying to get the complementary combination out of the node sets of prompts. In the paper they adopted a metric (to evaluate which node's got the desired module mutation) that involves common ancestors.

The merging mechanism left me wondering about some questions.

1. In two compound AI systems, each having language modules exceptional in different field of missions, how to combine them (a $2^{\\#modules}$ combination) so they result in the better?
2. GEPA discussed two way merging. Will k-way merging ever be valuable?

[^1]: They claimed so, yet the pseudo code didn't reflect appearing-to-be Pareto check.

## ACE

This is a framework. They basically fine-tuned the input ("context") fed to LLM in a ReAct loop.

They assumed LLM is able to handle long texts and distill pertinent information. 

## SkillOpt

The core idea is bounded edits and learning rate borrowed from neural network. Much like GEPA, SkillOpt learns from trajectories and text feedback, but instead of monolithic updates (meaning having LLMs rewrite the entire skill each update), it employs several forms of edits: `insert_after`, `replace`, `delete` etc. In each rollout there are multiple minibatches and every minibatch produces a set of edits. It adds up to lots of edits, capped at $L$ (the learning rate). Prefer edits that fix failures over ones that reinforce success.

They say SkillOpt is for single skill optimization, but I don't see how it cannot generalize to multiple skills or any text prompt. I'm currently experimenting a custom skill evolution architecture resembling SkillOpt with complex skills that involve multiple text parts. Interesting to see how it goes.

## SkVM
