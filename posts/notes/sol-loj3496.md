---
date: '2023-10-31'
title: 'Solution -「JOISC 2021」イベント巡り 2'
---

## Desc.

[Link.](https://loj.ac/p/3496)

给定 $n$ 个区间 $[l_i, r_i)$, 问是否能选出恰好 $k$ 区间, 使得两两无交, 并构造一组字典序最小的解.

$1\leqslant n \leqslant 10^5$.

## Sol.

一道套着信息学奥赛外壳的 HOMO 题, 撅了好久, やりますね.

考虑如何最小化字典序. 已知前 $i-1$ 个数的选择情况 $S \in 2^{\{1, \dots i-1\}}$, 现在对 $i$ 进行决策. 只需要判断后 $n-i$ 个元素中是否能选出 $k - |S| - 1$ 个无交元素即可, 若能则将 $i$ 加入. 维护 $f(L, R)$ 表示在数轴 $[L, R]$ 上能选出的最大不相交区间数, 于是加入 $i$ 造成的变化就是 $f(L, l-1)+f(r+1, R)-f(l, r)+1$.

于是问题转化成了维护 $f(L, R)$, 由于区间无交, 我们贪心地选择当前能加入的区间中右端点最小的, 于是可以倍增. 令 $f[i][j]$ 为从数轴上 $j$ 出发, 选择 $2^i$ 个无交区间, 能到达地最小右端点. 直接转移即可.

注意 $f$ 的初值, 由于同一个 $l_i$ 可以对应多个 $r_j$, 因此要取 $\min$.

```cpp
struct Interval {
    int l, r;
    Interval(int _l, int _r) : l(_l), r(_r) {}
    bool operator<(const Interval& rhs) const { return r < rhs.l; }
};
int main() {
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vi l(n), r(n), uni;
    for (int i=0;i<n;++i) {
        cin >> l[i] >> r[i];
        uni.pb(l[i]), uni.pb(r[i]);
    }
    sort(allu(uni));
    uni.erase(unique(allu(uni)), end(uni));
    for (int i=0;i<n;++i) {
        l[i] = lower_bound(allu(uni), l[i])-begin(uni);
        r[i] = lower_bound(allu(uni), r[i])-begin(uni)-1;
    }
    const int m = uni.size();
    const int t = __lg(k)+1;
    vvi f(t, vi(m, m));
    for (int i=0;i<n;++i) chkmin(f[0][l[i]], r[i]);
    for (int i=m-2;i>=0;--i) chkmin(f[0][i], f[0][i+1]);
    for (int i=1;i<t;++i)
        for (int j=m-1;j>=0;--j) {
            if (j+1 < m) f[i][j] = f[i][j+1];
            if (f[i-1][j]+1 < m) chkmin(f[i][j], f[i-1][f[i-1][j]+1]);
        }
    /// @returns: the maximum number of disjoint segments in [@cl, @cr]
    const auto calc = [&](int cl, int cr) {
        if (cl > cr) return 0;
        int res = 0;
        for (int i=t-1;i>=0;--i)
            if (f[i][cl] <= cr) cl = f[i][cl]+1, res += 1<<i;
        return res;
    };
    int tot = calc(0, m-1), cnt = 0;
    if (tot < k) {
        cout << "-1\n";
        return 0;
    }
    set<Interval> s;
    s.emplace(0, m-1);
    for (int i=0;i<n;++i) {
        if (cnt == k) break;
        auto it = s.lower_bound(Interval(l[i], r[i]));
        if (it == s.end()) continue;
        const auto [cl, cr] = *it;
        if (cl > l[i] || cr < r[i]) continue;
        int dlt = calc(cl, l[i]-1)+calc(r[i]+1, cr)-calc(cl, cr)+1;
        if (tot+dlt >= k) {
            cnt++;
            tot += dlt;
            s.erase(it);
            if (cl < l[i]) s.emplace(cl, l[i]-1);
            if (cr > r[i]) s.emplace(r[i]+1, cr);
            cout << i+1 << "\n";
        }
    }
}
```

---

> / 寒星坠地 白鸟飞去 /
>
> / 千宵灯火转眼便览尽 /
>
> —— [COP - *光与影的对白* ft. 洛天依](https://vocadb.net/S/420899)