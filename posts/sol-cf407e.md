---
date: 2022-11-05
title: 「codeforces - 407E」k-d-sequence
category: notes
tags: [data-structures]
---

[link．](https://codeforces.com/problemset/problem/407/E)

不错的题．

改写条件．我们称一个区间 $[l, r)$ 是合法的当且仅当 $\forall i \in [l, r)$，有 $a_i \equiv k \pmod d$，$\not\exists j \in [l, r), j \neq i, s.t. a_j = a_i$，且 $\max_{[l, r)} - \min_{[l, r)} + l < r+k$．考虑扫描线枚举 $r$，现在我们就考虑维护 $f_i = \max_{[i, r)} - \min_{[i, r)} + i$．假设我们使用线段树来维护，那么在查询的时候使用线段树二分即可．现在考虑如何快速维护加入 $a_{i+1}$ 这个元素到线段树里面．

观察 $f_i$ 的结构，首先 $i$ 可以预处理进线段树，全程不需要动．以维护 max 为例，我们可以引入一个非严格递减的单调栈，单调栈中的每一个元素表示了原数组中一段的最大值．意即，这个单调栈中的元素充当了「哨兵」的角色，将原序列分成了若干的被统治区间．于是就可以简单维护了．

```cpp
#include <cstdio>
#include <cassert>
#include <map>
#include <algorithm>
#include <utility>
using Pr = std::pair<int, int>;
#define rep(i,a,b) for (int i(a); i<=(b); ++i)
#define rep_(i,a,b) for (int i(a); i<(b); ++i)
#define drep(i,b,a) for (int i(b); i>=(a); --i)
inline int rint() {
    int n(0), f(1);
    char s(getchar());
    for (; s<'0'||s>'9'; s=getchar())
        if (s == '-') f = -1;
    for (; s>='0'&&s <= '9'; s=getchar()) n = n*10+s-48;
    return n * f;
}

const int kMaxN = 200100;
const int inf = std::numeric_limits<int>::max();
int n, K, d, a[kMaxN], stk1[kMaxN], stk2[kMaxN], T1, T2;

struct segment_tree {
#define mid ((l+r)/2)
    int lz[kMaxN*4], s[kMaxN*4];
    void build(int i, int l, int r) {
        if (l == r) s[i] = l;
        else build(i*2, l, mid), build(i*2+1, mid+1, r), s[i] = std::min(s[i*2], s[i*2+1]);
    }
    void pr(int i, int w) { lz[i] += w, s[i] += w; }
    void push(int i) {
        if (lz[i] != 0) pr(i*2, lz[i]), pr(i*2+1, lz[i]), lz[i] = 0;
    }
    void upd(int l, int r, int w) { upd(l, r, w, 1, 1, n); }
    void upd(int qL, int qR, int w, int i, int l, int r) {
        if (l >= qL && r <= qR) return pr(i, w);
        else {
            push(i);
            if (mid >= qL) upd(qL, qR, w, i*2, l, mid);
            if (mid < qR) upd(qL, qR, w, i*2+1, mid+1, r);
            s[i] = std::min(s[i*2], s[i*2+1]);
        }
    }
    int bisect(int l, int r, int up) { return bisect(l, r, up, 1, 1, n); }
    int bisect(int qL, int qR, int up, int i, int l, int r) {
        if (l == r) return l;
        push(i);
        if (l >= qL && r <= qR) {
            if (s[i*2] <= up) return bisect(qL, qR, up, i*2, l, mid);
            else if (s[i*2+1] <= up) return bisect(qL, qR, up, i*2+1, mid+1, r);
            return n+1;
        }
        int res = n+1;
        if (mid >= qL && s[i*2] <= up) res = bisect(qL, qR, up, i*2, l, mid);
        if (res <= n) return res;
        if (mid < qR && s[i*2+1] <= up) return bisect(qL, qR, up, i*2+1, mid+1, r);
        return n+1;
    }
#undef mid
} sgt;

Pr solve(int L, int R) {
    rep_(i,L,R) a[i] /= d;
    T1 = T2 = 0;
    int nl = L, nr = L, lb = L;
    std::map<int, int> tak;
    stk1[0] = stk2[0] = L-1;
    rep_(i,L,R) {
        while (T1 && a[stk1[T1]] < a[i]) // non-strictly decreasing stack
            sgt.upd(stk1[T1-1]+1, stk1[T1], a[i]-a[stk1[T1]]), T1--;
        stk1[++T1] = i;
        while (T2 && a[stk2[T2]] > a[i]) // non-strictly increasing stack
            sgt.upd(stk2[T2-1]+1, stk2[T2], a[stk2[T2]]-a[i]), T2--;
        stk2[++T2] = i;
        int j = sgt.bisect(lb = std::max(lb, tak[a[i]]+1), i, i+K);
        if (i-j+1 > nr-nl+1) nl = j, nr = i;
        tak[a[i]] = i;
    }
    return Pr(nl, nr+1);
}

signed main() {
#ifdef cirnovsky
    freopen("in.txt", "r", stdin);
#endif
    n = rint(), K = rint(), d = rint();
    rep(i,1,n) a[i] = rint()+1e9+1;
    rep(i,1,n) assert(a[i] >= 0);
    sgt.build(1, 1, n);
    a[n+1] = -1;
    if (d == 0) {
        int las = 1, wl = 1, wr = 2;
        rep(i,2,n+1)
            if (a[i] != a[i-1]) {
                if (i-las > wr-wl) wr = i, wl = las;
                las = i;
            }
        printf("%d %d\n", wl, wr-1);
    } else {
        int nl = 1, ansl = 1, ansr = 2;
        rep(nr,2,n+1) {
            if (nr == n+1 || a[nr]%d != a[nr-1]%d) {
                Pr ret = solve(nl, nr);
                nl = nr;
                if (ret.second-ret.first > ansr-ansl)
                    ansl = ret.first, ansr = ret.second;
            }
        }
        printf("%d %d\n", ansl, ansr-1);
    }
}
/* 
1. mod d 结果相同
2. 无重复
3. max[l, r] - min[l, r]
monotonic stacks
*/
```
    