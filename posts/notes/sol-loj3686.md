---
date: '2023-10-23'
title: 'Solution -「JOISC 2022」京都観光'

---

## Desc.

[Link.](https://loj.ac/p/3686)

有 $h$ 条水平道路和 $w$ 条竖直道路, 在其上行走一个单位分别花费 $a_i$ 和 $b_j$, 问从 $(1, 1)$ 到 $(h, w)$ 的最小花费.

## Sol.

把步数拆到恰好拐一个弯的形状, 设从 $(i, j)$ 走到 $(i', j')$. 有两种方式, 其中一种是 $(i, j) \rightarrow (i', j) \rightarrow (i', j')$. 整理得到一个斜率形式. 合并两者凸包. (赶着回家, 写得比较草率...)

```cpp[class="line-numbers"]
int main() {
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vll a(n), b(m); rds(a), rds(b);
#define fi first
#define se second
    using pii = pair<ll, ll>;
    const auto cross = [&](const pii& a, const pii& b) {
        return a.fi*b.se-a.se*b.fi;
    };
    static int s1[100100], s2[100100], top1, top2;
    for (int i=0;i<n;++i) {
        while (top1 > 1 && cross({s1[top1]-s1[top1-1], a[s1[top1]]-a[s1[top1-1]]}, {i-s1[top1], a[i]-a[s1[top1]]}) < 0)
            top1--;
        s1[++top1] = i;
    }
    for (int i=0;i<m;++i) {
        while (top2 > 1 && cross({s2[top2]-s2[top2-1], b[s2[top2]]-b[s2[top2-1]]}, {i-s2[top2], b[i]-b[s2[top2]]}) < 0)
            top2--;
        s2[++top2] = i;
    }
    int i = 1, j = 1;
    ll ans = 0;
    while (i < top1 || j < top2) {
        if (i < top1 && (j == top2 || cross({s2[j+1]-s2[j], b[s2[j+1]]-b[s2[j]]}, {s1[i+1]-s1[i], a[s1[i+1]]-a[s1[i]]}) < 0)) {
            ans += (s1[i+1]-s1[i])*b[s2[j]];
            i++;
        } else {
            ans += (s2[j+1]-s2[j])*a[s1[i]];
            j++;
        }
    }
    cout << ans << "\n";
}
```