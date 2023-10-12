---
date: '2022-06-27'
title: 'Solution -「CF 1550F」Jumping Around'
category: 'Notes'
---

题不错，但是花了很久啊，完全比不过贺题怪。

答案有单调性，转化求每个点被跳到所需的最小 $k_i$，容易想到用整体二分维护一个有 $s$ 的连通块，每次拓展的时候就考虑在值域范围内的点能不能在 $k$ 取 $(l+r)/2$ 的时候跳出去。具体而言，就是看能不能以 $k=(l+r)/2$ 跳到 $k_i<l$ 的点上（1）。

但是这样会少点，因为值域范围内的点能够跳出去，而值域范围内有些不能跳出去的点可以藉由这些点间接跳出去（2）。

现在的问题就是如何维护（1）类点。我们在执行整体二分的时候先递归左子树，这样跑到叶子的时候把叶子加入一个数据结构（`std::set` is enough），这样我们递归到后面的结点时数据结构中存放的就是所有的（1）类点，跑完（1）类点再把值域范围内剩下的点依次判断能否间接跳出去即可。


```cpp
#include <bits/stdc++.h>
using namespace std;
using P = pair<int, int>;
int n, Q, st, d, a[200100], ans[200100], q[200100];
int q1[200100], q2[200100];
set<int> s;
void solve(int l, int r, int lq, int rq) {
    if (l == r) {
        for (int i=lq; i<=rq; ++i) {
            ans[q[i]] = l;
            s.insert(a[q[i]]);
        }
        return;
    }
    set<P> now;
    for (int i=lq; i<=rq; ++i) {
        now.emplace(a[q[i]], q[i]);
    }
    int mid = (l+r)/2, tl = 0, tr = 0;
    for (int i=lq; i<=rq; ++i) {
        auto it = s.lower_bound(a[q[i]]-d-mid);
        if (it != s.end() && (*it) <= a[q[i]]-d+mid) {
            q1[++tl] = q[i];
            now.erase(P(a[q[i]], q[i]));
        }
        else {
            it = s.lower_bound(a[q[i]]+d-mid);
            if (it != s.end() && (*it) <= a[q[i]]+d+mid) {
                q1[++tl] = q[i];
                now.erase(P(a[q[i]], q[i]));
            }
        }
    }
    for (int i; tl;) {
        i = q1[tl--];
        auto it = now.lower_bound(P(a[i]-d-mid, 0));
        while (it != now.end() && it->first <= a[i]-d+mid) {
            q1[++tl] = it->second;
            it = now.erase(it);
        }
        it = now.lower_bound(P(a[i]+d-mid, 0));
        while (it != now.end() && it->first <= a[i]+d+mid) {
            q1[++tl] = it->second;
            it = now.erase(it);
        }
    }
    tl = 0;
    for (int i=lq; i<=rq; ++i) {
        if (now.count(P(a[q[i]], q[i]))) {
            q2[++tr] = q[i];
        }
        else {
            q1[++tl] = q[i];
        }
    }
    for (int i=1; i<=tl; ++i) q[lq+i-1] = q1[i];
    for (int i=1; i<=tr; ++i) q[lq+tl+i-1] = q2[i];
    solve(l, mid, lq, lq+tl-1);
    solve(mid+1, r, lq+tl, rq);
}
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    cin >> n >> Q >> st >> d;
    int cnt = 0;
    for (int i=1; i<=n; ++i) {
        cin >> a[i];
        if (i != st) {
            q[++cnt] = i;
        }
    }
    s.insert(a[st]);
    solve(0, 1e6, 1, cnt);
    for (int i, k; Q--;) {
        cin >> i >> k;
        if (ans[i] <= k) {
            cout << "yEs\n";
        }
        else {
            cout << "nO\n";
        }
    }
    return 0;
}
```