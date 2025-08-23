---
date: 2022-08-19
title: 「atcoder - agc054c」Roughly Sorted
category: notes
tags: [combinatorics]
---

[link。](https://atcoder.jp/contests/agc054/tasks/agc054_c)

高妙题，我只会到构造下界那一步……

构造下界比较容易，只需要注意到交换一次最多让序列向合法迫近一步即可。则答案下界为 $\sum_i \max\{\left(\sum_{j < i} [p'_j > p'_i]\right)-k, 0\}$。

然后需要构造一个映射：排列长相到每个位置的逆序对数量的单射（因为逆序对数量可能不合法……），意即每个位置的逆序对数量唯一决定了排列。证明考虑交换排列任意两项即证。

然后就容易了，$cnt_i > k$ 不合法，$cnt_i < k$ 的我们不会去调整（必定劣），只有 $cnt_i = k$ 时给了我们 $n-i+1$ 的操作空间，乘起来即可。

```cpp
int n, K, a[5100], cnt[5100];
signed main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
  cin >> n >> K;
  for (int i = 1; i <= n; ++i) cin >> a[i];
  for (int i = 1; i <= n; ++i) {
    for (int j = 1; j < i; ++j) cnt[i] += a[j] > a[i];
  }
  int ans = 1;
  for (int i = 1; i <= n; ++i)
    if (cnt[i] == K) ans = 1ll * ans * (n - i + 1) % 998244353;
  cout << ans << "\n";
}
```
    