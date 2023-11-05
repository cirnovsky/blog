---
date: '2020-01-23'
title: 'Note -「KMP」'

---

# 0x00 前言

本文和某播放软件KMPlayer没有一毛钱关系

# 0x01 引入问题

设想这样一个问题：

给你两个字符串，让你查找在文本串中模式串的位置。

暴力做法是显然的，举例来说：

文本串(text)：$a\ b\ c\ b\ c\ g\ l\ x$

模式串(pattern): $b\ c\ g\ l$

我们直接暴力枚举text中的每一个字符，并且依次与pattern中的字符从头开始匹配。时间复杂度为 $\Theta(nm)$

# 0x02 发现问题

这样做其实有很多冗余操作。比如说：$b\ c\ g\ l$ 与text中的 $b\ c\ b\ c$ 不匹配，又从第text的第五个字母 $c$ 开始匹配。这样做是显然不必要的。为什么呢？因为模式串是以  $b$ 开头的，对于text中第五个字母 $c$ 显然我们可以不去匹配。发现了什么吗？每次失配后我们只需要从两个字符串的最长公共部分开始匹配即可。这里看不懂没有什么关系，只要能理解后面的例子就可以了。

# 0x03 解决一部分问题

$\qquad\qquad\quad\ 0\ \ 1\ \ 2\ \ 3\ \ 4\ \ 5\ \ 6\ \ 7\ \ 8\ \ 9\ 10\ 11$

文本串(text)： $a\ \ b\ \ x\ \ a\ \ b\ \ c\ \ a\ \ b\ \ c\ \ a\ \ b\ \ y$

$\qquad\qquad\qquad\ \ \ 0\ \ 1\ \ 2\ \ 3\ \ 4\ \ 5$

模式串(pattern)： $a\ \ b\ \ c\ \ a\ \ b\ \ y$

我们有两个指针i和j，分别指向文本串和模式串。在i=0,j=0以及i=1,j=1的时候都匹配上了。但是在i=2,j=2时失配了。如果时朴素算法的话会令i=1,j=0重新开始匹配。然而我们发现我们完全可以令i=3,j=0来重新匹配。一直到i=8,j=5时，它们又失配了。我们令j等于模式串和文本串已经配对完成的部分(即pattern[0]~pattern[4])的最长公共前缀后缀(即pattern[0,1]和pattern[3,4])的前缀末尾部分+1(即1+1=2)的地方，此时的text[6,7]和pattern[0,1]都是ab也就是说我们可以直接从i=8,j=2开始匹配，就可以匹配到模式串了。这就是KMP玄妙的地方。

# 0x04 解决另一部分问题

那么问题来了：我们如何确定模式串最长公共前后缀的前缀末尾+1的位置呢？我们还是通过一个例子来感受。

$\qquad\qquad\qquad\ \ \ 0\ \ 1\ \ 2\ \ 3\ \ 4\ \ 5$

模式串(pattern)： $a\ \ b\ \ c\ \ a\ \ b\ \ y$ (没错就是上面那个我太懒了)

我们可以设数组$next_i$为以 $i$ 为结尾的模式串最长公共前后缀的前缀末尾+1的位置。

$next_0$显然为0。

我们依然设两个指针i和j，i初始化为0，即指向模式串的开头。j初始化1，即i后面一个。

pattern[i]不等于pattern[j]，令next[i]=0，j+=1

pattern[i]依然不等于pattern[j]，令next[i]=0，j+=1

此时pattern[i]等于pattern[j]，令next[i]=j+1=1，i+=1，j+=1

此时pattern[i]等于pettern[j]，令next[i]=j+1=2，i+=1,j+=1

此时pattern[i]不等于patter[j]，并且j不在模式串的开头，令j=next[j-1]=2

此时pattern[i]依然不等于pattern[j]，并且j不在模式串的开头，令j=next[j-1]=0

此时pattern[i]依然不等于pattern[j]，但是j已经跑到开头去了，令i+=1

此时pattern[i]依然不等于pattern[j]，并且i已经跑到了尽头，求解结束。

%出来next数组是这样的:$[0,0,0,1,2,0]$

# 0x05 解决所有问题

~~其实就是放一下代码~~

我自认为讲的还是比较清楚，~~至少比蓝书好~~。

代码虽然和网上其他人的不太一样，不太标准，但还算简洁，~~至少比蓝书好~~。

总之一句话，学KMP不要看书，不要看书，不要看书！！！会死人的！！！

对了还有一个坑点，我这份代码用std::string会RE，~~鬼知道我调了一下午发现是这个原因时心里有多傻逼~~


```cpp[class="line-numbers"]
/*
 * P3375【模板】KMP字符串匹配.cpp
 * Created by boringhacker(c20220233wgy)
*/
#include <cstdio>
#include <iostream>
#include <algorithm>
#include <cstring>
#include <queue>

using namespace std;

namespace MAIN {
    const int SIZE = 1000000 + 5;
    int next[SIZE], n, m;
    char Text[SIZE], Pattern[SIZE];
    // string Text, Pattern; 去你的std::string

    void GetNextVal() {
        int i = 1, j = 0;
        *next = 0;
        while (i < n) {
            if (Pattern[i] == Pattern[j])
                next[i] = j + 1, ++i, ++j;
            else if (j) j = next[j - 1];
            else ++i;
        }
    }

    void GetAnswers() {
        int st = 0, res = -1;
        int i = 0, j = 0, flag = 0;
        while (true) {
            j = st;
            if (Text[i] == Pattern[j]) {
            	if (!flag) res = i + 1 - st, flag = 1;
                if (j == n - 1) cout << res << endl, j = 0, flag = 0;
                else ++i, ++j;
                st = j;
                if (i >= m) return ;
            }
            else {
            	if (j) st = next[j - 1];
            	else ++i;
            	flag = 0;
			}
        }
    }

    void MAIN() {
        cin >> Text;
        cin >> Pattern;
        m = strlen(Text);
        n = strlen(Pattern);
        GetNextVal();
        GetAnswers();
        for (int i = 0; i < n; ++i) cout << next[i] << ' ';
    }
}

signed main() {
    MAIN::MAIN();
    return 0;
}
```

# 欢迎捉虫子