---
date: '2023-09-20'
title: '我的 Windows 文件管理哲学'
category: 'Articles'
---

## 前言

作为一个不合格的 Geek，我经常面临把 Windows 弄崩溃的尴尬处境，我的系统因此重装了一遍又一遍……不过在一次次的重装中，我逐渐总结出了于我个人而言行之有效的文件管理哲学，在此略做总结。

## 管理方法

### 磁盘分区

我个人对磁盘分区没有什么特别的需求，现代的操作系统与电脑一般不会出现崩溃到不得不丢失分区的情况，只要装个 PE 就能基本解决需求。除非你喜欢无盘安装系统。因此，为了便于管理，我的 Windows 一般只会有一个分区。

### 用户安装软件

如果你现在依然保留着「安装软件无脑下一步」的习惯，我不会说你错了，但我自己肯定不会采用这种方法。我个人认为方便的方法是创建 `C:\-software-` 文件夹，并将常用软件安装在里面。每个软件单独拥有一个子文件夹，并且以软件名称的全称或缩写命名，仅包括减号、小写字母以及数字。一些常用的单 exe 应用直接放在该目录下即可，不需要创建子文件夹。

比如，我现在的软件文件夹的层级结构就是这样的：

```treeview
C:\-software-/
|-- 7z/
|-- calibre/
|-- cfw/
|-- everything/
|-- flameshot/
|-- iobit-unlocker/
|-- pwa/
|-- qbit/
|-- qq/
|-- steam/
|-- sublime-text/
|-- taskbarx/
|-- telegram/
|-- typora/
|-- vlc/
|-- vscode/
|-- geek.exe/
```

当然，你也许想新建其他的文件夹来储存不同类型的软件，那么请用 `-yourfoldername-` 的文件夹命名方式放到根目录下，以区别于 Windows 自动创建的文件夹。

### 用户文件

你当然会有无数的音频、视频、文档文件在你的电脑上，而在这些文件的分类上，Windows 已经为我们完成了工作！File Explorer 中的 Quick Access 栏中为我们预置了不同图标的 `Documents`、`Pictures`、`Videos` 文件夹，不要感到负担地把你的文件放进去吧！只需要再细致地把不同性质的各类文件用子文件夹的方式做好分类即可。此时，我们的子目录命名方式应该遵从 Windows 的命名规则，将每个单词的首字母大写并以空格分隔。

## 总结

这一套仅仅是从我个人的角度出发比较方便的管理方法，并不具有普适性，仅仅作为系统重装前的检查列表整理出来。