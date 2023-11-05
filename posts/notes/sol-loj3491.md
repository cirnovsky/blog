---
date: '2022-06-26'
title: 'Solution -「JOISC 2021」道路の建設案'
---

[link。](https://loj.ac/p/3491)

非常离谱, 但它确实在 loj fastest rank 2 站着.

我们首先看得出来这是个无脑分讨题, 考虑怎么能减少点讨论 (motivation) (不).

constructive method: 令 $x'_i=x_i-y_i$, $y'_i=x_i+y_i$, 然后绝对值相加就变成绝对值取 $\max$ 蜡!

但是是个 trivial trick (?), 小丑了.

然后就排序第一个关键字, 二分答案再 check 构造答案即可.

```cpp[class="line-numbers"]
#include <bits/stdc++.h>
#define pii pair<int, int>
#define mp(x, y) make_pair(x, y)
using namespace std;
typedef long long ll;
#define int ll
int N, K, ans[250100], cnt;
pii p[250100];
set<pii> s;
set<pii>::iterator it;
ll dist(int x, int y) {
      return max(abs(p[x].first - p[y].first), abs(p[x].second - p[y].second));
}
bool check(ll M) {
      cnt = 0;
  s.clear();
  for (int i = 1, t = 1; i <= N; ++i) {
        while (t < i && p[i].first - p[t].first > M) {
          // 固定第一维
      s.erase(mp(p[t].second, t));
      t++;
    }
    it = s.lower_bound(mp(p[i].second - M, 0));
    for (; it != s.end(); ++it) {
          if (it->first - p[i].second > M) {
            break;
      }
      ans[++cnt] = dist(it->second, i);
      if (cnt >= K) return 0;
    }
    s.insert(mp(p[i].second, i));
  }
  return cnt < K;
}
signed main() {
      ios::sync_with_stdio(0), cin.tie(0);
  cin >> N >> K;
  for (int i = 1, x, y; i <= N; ++i) {
        cin >> x >> y;
    p[i] = mp(x - y, x + y);
  }
  sort(p + 1, p + N + 1);
  ll l = 0, r = 4e9, Mid, res = 0;
  while (l <= r) {
        if (check(Mid = (l + r) / 2)) {
          l = Mid + 1, res = Mid;
    } else {
          r = Mid - 1;
    }
  }
  check(res);
  sort(ans + 1, ans + cnt + 1);
  for (int i = 1; i <= cnt; ++i) {
        cout << ans[i] << \"\\n\";
  }
  for (int i = cnt + 1; i <= K; ++i) {
        cout << res + 1 << \"\\n\";
  }
  return 0;
}
```