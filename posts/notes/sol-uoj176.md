---
date: '2022-11-02'
title: 'Solution -「UOJ 176」新年的繁荣'
---

[link。](https://uoj.ac/problem/176)

文章抄袭于 [曾经的 cq 之光](https://blog.csdn.net/qq_42101694/article/details/104065299)。

先咕了，睡觉比较重要。

```cpp
#include <iostream>
#include <numeric>
#define rep(i,l,r) for (int i=l;i<=(r);++i)
#define drep(i,r,l) for (int i=(r);i>=(l);--i)\r\ninline int read() {
        int n = 0, f = 1;
    char s;
    for (; s<\'0\'||s>\'9\'; s=getchar())
        if (s == \'-\') f = -1;
    for (; s>=\'0\'&&s<=\'9\'; s=getchar())
        n = n*10+s-48;
    return n*f;
}

const int kMaxN = 1<<18;\r\nint n, m, a[kMaxN], f[kMaxN];

namespace ufs {
        int fa[kMaxN];
    void init(int n) {
            std::iota(fa+1, fa+n+1, 1);
    }
    inline int find(int u) {
            while (u != fa[u])
            u = fa[u] = fa[fa[u]];
        return u;
    }
    bool merge(int u, int v) {
            u = find(u), v = find(v);
        if (u != v) {
                fa[u] = v;
            return 1;
        }
        return 0;
    }
}

signed main() {
        n = read(), m = read();
    ufs::init((1<<m)-1);
    long long ans;
    rep(i,1,n) {
            a[i] = read();
        if (!f[a[i]]) f[a[i]] = a[i];
        else ans += a[i];
    }
    drep(i,(1<<m)-1,0) {
            for (int j=0; j<m&&(!f[i]); ++j)
            f[i] = f[i|(1<<j)];
        rep(j,0,m-1)
            if (f[i] && !(i>>j&1) && f[i|(1<<j)] &&
                ufs::merge(f[i], f[i|(1<<j)]))
                ans += i;
    }
    printf(\"%lld\\n\", ans);
}
```
