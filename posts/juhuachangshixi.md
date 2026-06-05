---
date: 2026-06-02
title: "菊花厂实习"
category: articles
tags: [trash]
---

__*Week 4……*__

主要参与的项目是 benchmark 刷分，优化 OpenJiuwen（以下简称 OJ）的 harness 在 Terminal Bench 2 上的表现。

第二周负责写了个工具，实现逐帧 OCR 视频文件以提升视频理解能力。

听涛哥说现在很多大模型厂商内置了视频理解，只需提供 URL 或者视频文件就能获得上下文进行问答。OJ 原本就是直接调用大模型的多模态能力实现的视频理解。

然而[某些场景](https://github.com/harbor-framework/terminal-bench-2/tree/main/extract-moves-from-video)要求对视频文字的精准提取，LLM 的内置视频理解就显得力不从心。顾得了 big picture，顾不得局部的精准文字提取。

*TODO: 学习多模态能力原理，为什么在精准提取文字上表现不尽如人意*

所以 Video OCR 工具是有其必要性的，希望最后能 merge，好歹算个成果。在需要视频文字提取的任务下实现从 0/5 到 2/5 的突破。

只不过 agent team 跑出了 5/5 的成绩，还没有被记录到工作文档里。我不知道为什么不记录，也还没有拿到 5/5 对应的轨迹。得去找筱能要。

上周光阳旅游去了，我主要和涛哥对接。涛哥让我统计榜单上低通过率题目的高通过率模型，让 OJ 用对应的模型跑对应的题目。有几道题从 0/5 飙升到 5/5，顿感玄学。

涛哥说模型有不同先验知识，在不同场景能力有差异。细想很有道理，没那么玄学了。

晕……下午看 agent team 轨迹发现全是 reward hacking，这么看来我的视频工具还是有合并必要的。跟光阳涛哥商量后[合并](https://gitcode.com/kwangyyinc/jiuwen-terminal-bench/commit/cfbf8421233a724ad67e78cd3c3f36473a25e632?ref=develop)了。

阳光明媚风和日丽的下午，代码已经合并。下个任务分析 OJ 在 TB2.1 有改动的任务上的表现（之前是 TB2），所以现在在跑。许多任务反而分数变低了，只有[这个任务](https://github.com/ekellbuch/terminal-bench-2/tree/56fc6147c7426e7588cc8e089c6f791da0aad0e9/filter-js-from-html)变高。

__*新业务？？*__

涛哥说 OJ 要接入鸿蒙浏览器，需要做一个新的 browser agent。

新知识！！CDP AND PLAYWRITIGHT！！！

但是听起来像纯粹应用层，虽然很重要吧，但 less novelty，less exciting。

和涛哥跟进了一下视频工具，发现原来的设计有些 dead code，不仅是 `video_ocr`，包括其他视觉工具。

好吧，依旧老业务。和涛哥商量后决定重构 `read_file`，对于视频和图像媒体支持两种模式：

1. 媒体文件作为上下文（已经实现）；
2. 媒体文件提取信息作为上下文（也就是 OCR 文本信息）作为上下文。对于视频进行逐帧处理。

`video_understanding` 工具转型成 YouTube URL 专用，`image_ocr` 和 `video_ocr` 并入 `read_file` 实现第二种模式，不再暴露给 agent。

虽然只是一次结构重构，但我也可以顺便拓宽视频工具的场景。

合理。老资历牛批。

遇到始料未及的困难。TB 和 OJ 的 `read_file` 互相耦合，很难在不对 OJ 做大幅更改的情况下完成重构。

不如这样，先在 TB 创建新的工具 `new_read_file`，让 agent 用新的文件读取工具，验证方法论可行，再考虑怎么嵌入原来的代码。
