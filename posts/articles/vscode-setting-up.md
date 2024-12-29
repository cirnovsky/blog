---
date: '2020-01-16'
title: 'VS Code 配置指北'
category: 'Articles'
---

# 0x00 序言

天天看着Dev-Cpp的somebody界面想不想换一个新的环境呢？VS太大，sublime也是一个不错的选择，但sublime的Ctrl+D实在是有些堪忧。今天我们就来尝试一下VSCode

# 0x01 下载VSCode

不要下官网的，下我给的VSCode Portable。链接：

[某盘](https://pan.baidu.com/s/1TSlDZe84mlXqx58mrLCE-Q)

提取码: m2p2

链接挂了评论区请

upd:真的挂了，我直接贴一个原作者的link吧：[某盘](https://pan.baidu.com/s/1-c_53Yi3zw7I4ObYOhJ_iw)

提取码：ac25

为什么不下载官网的呢？因为我们要制作的是随身携带的便携版。

本来我打算自己绿化的，但有现成的就懒了

# 0x02 下载插件

下载以后，先下载几个插件

1.![blog.png](https://i.loli.net/2020/01/16/teHNPsOaKYBu8CJ.png)

2.![blog.png](https://i.loli.net/2020/01/16/s5dnF8L6EXrlCOK.png)

3.![blog.png](https://i.loli.net/2020/01/16/Az2gW9vkny1j35O.png)

# 0x03 配置文件

在Code.exe所在的文件夹(也就是根目录)创建三个文件

`c_cpp_properties.json`:

```json
{
  "configurations": [
    {
      "name": "Win32",
      "defines": ["_DEBUG", "UNICODE", "_UNICODE"],
      "compilerPath": "C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin\\g++.exe",
      "windowsSdkVersion": "10.0.17763.0",
      "intelliSenseMode": "msvc-x64",
      "cStandard": "c11",
      "cppStandard": "c++17"
    }
  ],
  "version": 4
}
```

`launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "(msvc) Launch",
        "type": "cppvsdbg",
        "request": "launch",
        "program": "${workspaceFolder}/1.exe",
        "args": [],
        "stopAtEntry": true,
        "cwd": "${workspaceFolder}",
        "environment": [],
        "externalConsole": false
      }
    ]
  }
```

`tasks.json`:

```json
{
    "version": "2.0.0",
    "tasks": [
      {
        "label": "msvc build",
        "type": "shell",
        "command": "cl.exe",
        "args": ["/EHsc", "/Zi", "/Fe:", "1.exe", "1.cpp"],
        "group": {
          "kind": "build",
          "isDefault": true
        },
        "presentation": {
          "reveal": "always"
        },
        "problemMatcher": "$msCompile"
      }
    ]
  }
```

把你的MinGW的bin文件夹添加进环境变量，就可以按下F6编译运行你的C++文件了

# 0x04 完全绿化

每次换电脑都要添加环境变量挺烦的对不对？其实，我们可以把VSCode根目录里的东西

![blog.png](https://i.loli.net/2020/01/16/p3QmLVTfwy5God9.png)

Copy到MinGW的bin文件夹里

![blog.png](https://i.loli.net/2020/01/16/yiH8KtpxRBYJhlq.png)

这样，不用添加环境变量我们就可以直接编译啦！

最后建议把VSCode和MinGW的文件隐藏一下，免得辣眼睛，最好创建一个Code.exe的快捷方式，方便打开

VSCode还可以装很多插件，下面给出几种大家自己慢慢摸索吧！

## Extensions

- open the web page
- C/C++
- C/C++ Compile Run
- Chinese
- filesize
- Markdown All in One
- Markdown PDF
- Open In Default Browser
- vscode icons
- Better Comments
- Auto Close Tag
- Windows opacity
- Background

## Themes

- Bimbo
- One Dark Pro
- Dracula Official