---
date: '2020-01-12'
title: 'Article -「常用 Bat 脚本」'
category: 'Articles'
---

# 1.批量换后缀

```bat
ren *.txt *.cpp
```

(将.txt和.cpp换成自己的后缀即可)

# 2.批量替换文件名中的某些字符

```bat
@echo off
setlocal enabledelayedexpansion
for %%j in (*_*) do (
set filename=%%~nj
set filename=!filename:.=_!
set filename=!filename: =!
if not "!filename!"=="%%~nj" ren "%%j" "!filename!%%~xj"
)
```

(自己替换)