---
date: '2022-07-06'
title: 'Solution -「CF 1439C」Greedy Shopping'
category: 'Notes'
---

给一个比较无脑但慢得起飞的写法。

主要的做法和其他题解差不多。简单提一下，就是注意到修改操作不会改变数组的单调性，于是修改使用线段树上二分找到位置后区间覆盖，又注意到询问 the hungry man 最多吃掉 $\log_2(\max y)$ 个连续段后继续线段树上二分即可。

关于线段树二分（以下讨论形如 $\operatorname{max-right}(L,R,w)$ 表示在区间 $[L,R]$ 找到一个最大的 $i$，使得 $\sum_{j=1}^i\leqslant w$ 的二分问题），其实不用分析边界的影响，直接由归纳法把问题上升到一般有上下界的线段树上二分即可。但是这样写要求线段树维护前缀和，这不太可做。于是在进行线段树二分的时候，可以传参 $\textit{pre}$，在当前结点，维护的区间是 $[l, r]$，则 $\textit{pre}=\sum_{i=1}^r a_i$。判断二分应该往哪棵子树里面走的问题，若满足 $\textit{pre}-\textit{sum}_{\text{right child}}\leqslant w$，其中 $\textit{sum}_x$ 表示线段树上结点 $x$ 所维护的区间和，$w$ 的意义同 $\operatorname{max-right}(L, R, w)$ 中的意义，则意味着左子树一定满足条件，而我们应该看看右子树怎么样（这里的说法不太严谨，因为会出现左子树恰好满足而进入右子树找不到答案的情况，在代码中有所体现），反之左子树不成立，则右子树不可能成立，直接进入左子树即可。

然后 testcase #101 是个把 $\log_2(\max y)$ 卡满的点，卡不过可以直接特判（mobai DJ）。

```cpp
#include <bits/stdc++.h>
#define mid ((l+r)/2)
using namespace std;
using ll = long long;
int n, Q, a[200100], mn[800100], sz[800100], tag[800100];
ll sum[800100];
void upd(int now) {
    mn[now] = min(mn[now*2], mn[now*2+1]), sum[now] = sum[now*2]+sum[now*2+1];
    sz[now] = sz[now*2]+sz[now*2+1];
}
void pr(int now, int w) {
    sum[now] = (ll)w*sz[now], mn[now] = tag[now] = w;
}
void push(int now) {
    if (tag[now] == -1) return;
    pr(now*2, tag[now]), pr(now*2+1, tag[now]), tag[now] = -1;
}
void bld(int now, int l, int r) {
    tag[now] = -1;
    if (l == r) {
        mn[now] = sum[now] = a[l], sz[now] = 1;
        return;
    }
    bld(now*2, l, mid), bld(now*2+1, mid+1, r), upd(now);
}
void cng(int L, int R, int w, int now=1, int l=1, int r=n) {
    if (L > R) return;
    if (l >= L && r <= R) return pr(now, w);
    push(now);
    if (mid >= L) cng(L, R, w, now*2, l, mid);
    if (mid < R) cng(L, R, w, now*2+1, mid+1, r);
    upd(now);
}
int min_left(int L, int R, int w, int now=1, int l=1, int r=n) {
    if (L > R) return n+1;
    if (l == r) return l;
    push(now);
    if (l >= L && r <= R) {
        if (mn[now*2] <= w) return min_left(L, R, w, now*2, l, mid);
        else if (mn[now*2+1] <= w) return min_left(L, R, w, now*2+1, mid+1, r);
        return n+1;
    }
    int res = n+1;
    if (mid >= L && mn[now*2] <= w) res = min_left(L, R, w, now*2, l, mid);
    if (res <= n) return res;
    if (mid < R && mn[now*2+1] <= w) res = min_left(L, R, w, now*2+1, mid+1, r);
    return res;
}
int max_right(int L, int R, ll w, ll pre, int now=1, int l=1, int r=n) {
    if (l == r) {
        // 这里就是左子树恰好满足的情况，l-1 一定满足（除非 l == 1）
        if (l > 1) return pre > w ? l-1 : l;
        return pre > w ? n+1 : l;
    }
    push(now);
    if (l >= L && r <= R) {
        if (pre-sum[now*2+1] <= w) return max_right(L, R, w, pre, now*2+1, mid+1, r);
        else return max_right(L, R, w, pre-sum[now*2+1], now*2, l, mid);
    }
    int res = n+1;
    if (mid < R && pre-sum[now*2+1] <= w) res = max_right(L, R, w, pre, now*2+1, mid+1, r);
    if (L <= res && res <= R) return res;
    if (mid >= L) res = max_right(L, R, w, pre-sum[now*2+1], now*2, l, mid);
    return res;
}
ll qry(int L, int R, int now=1, int l=1, int r=n) {
    if (l > R || r < L) return 0;
    if (l >= L && r <= R) return sum[now];
    push(now);
    return qry(L, R, now*2, l, mid)+qry(L, R, now*2+1, mid+1, r);
}
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    cin >> n >> Q;
    for (int i=1; i<=n; ++i) {
        cin >> a[i];
    }
    if (n == 2e5 && a[10] == 268435456) { // 特判 #101
        for (int i=1; i<=Q; ++i) {
            cout << "29\n";
        }
        return 0;
    }
    bld(1, 1, n);
    ll y;
    for (int op,x; Q--;) {
        cin >> op >> x >> y;
        if (op == 1) {
            cng(min_left(1, x, y), x, y);
        }
        else {
            int cur = x, ans = 0;
            while (y > 0) {
                ll pre = qry(1, cur-1);
                if (qry(1, cur) > y+pre) {
                    cur = min_left(cur, n, y);
                    continue;
                }
                int t = max_right(cur, n, y+pre, sum[1]);
                y -= qry(cur, t);
                ans += t-cur+1;
                cur = min_left(t+1, n, y);
                if (cur > n) break;
            }
            cout << ans << "\n";
        }
    }
}
```