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

__*Week 5...*__

周末和小蟹同志在圣淘沙胡吃海塞。

非常不戳，现在 `new_read_file` 支持多模态读取啦！

发现效果一般，多次出现 fallback 到其他 OCR 工具的情况，尽管 `new_read_file` 的视频功能正常。

难道 Agent 会望文生义？

不行不行，还是把多模态功能移出来吧。

我决定在 `one-off` 的基础上，给 `video_understanding` 增加 `by-frame` 模式。

嗯～现在不会无缘无故 fallback 了，估计工具名称对 agent 选择工具的影响比我想象中大。

只要等涛哥同意就可以往 agent-core 里面迁移啦！

难绷了，涛哥放假了。

两周后回来，看来改 agent-core 要搁置一会儿了。那我还能干啥啊，继续写小小 gpt？

此时突然传来筱能的声音，让我和光阳研究 prompt caching，现在 harness 太烧钱了。

Nice！我还以为游手好闲了，开始研究！

__*Week 6...*__

上周五加了个班，顺便等小蟹同学下班。

发现了一个非常奇妙的事情，OJ 的 system prompt 居然有时间戳！

那缓存不就全部失效了嘛！怪不得开销这么大。

So 这周目前就打算清理一下代码的改动推到主仓，以及视频工具。

涛哥说视频工具等他 review。不过我也打算先整理一下，争取早日两处改动推到主仓！

但是时间戳放哪是个问题，待我下午细细研究一下。

岔个话题，最近感觉 computer use protocol 是个很有意思的概念，原本每个 agent 都要对每个 API 适配，如果有这样一个中间层（像 LSP），会不会是很有趣的事情！

最后时间戳就放用户输入那里了，测了几道题稳定性有所提升，这个工作差不多结束了。

周五摸大鱼。

__*Week 7...*__

周末觉得自演化是个很有意思的课题。

Prompt 的调优就应该是个被自动化的过程。人提供种子 prompt，让 llm 从经验中学习。

> 人执着于教 llm 方法论，但 llm 从经验中学的更快。

和涛哥和光阳聊了一下做自演化新项目的事。

光阳非常支持我的决定，为我能找到兴趣所在而高兴，光阳对我真是太好太好了。

我感到非常幸运，在菊花，实习生不是打杂的，我切身地感受到公司对我们成长的帮助。

但是团队负责自演化的知秋此时此刻还在美国看世界杯，只能先等她回来。

插句题外话，能搞出来 tbench 这种包罗万象的 benchmark 也是件很酷的事情。It surely requires an encyclopediac knowledge of computer science.

Or video games.

所以我想尝试一下 Doom。上周已经在玩 Zork 了。
