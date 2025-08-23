---
date: 2022-09-12
title: 「hdu - 4035」Maze
category: notes
tags: [dp,expectations]
---

设 $dp_x$ 为从 $x$ 走出去的期望步数，可以写出转移 $\displaystyle dp_x = k_x \cdot dp_1 + e_x \cdot 0 + (1 - k_x - e_x) \cdot \sum_{(x, y) \in \mathbb E} \frac{dp_y + 1}{d_x}$。这个转移有环，又不能直接高消，于是考虑树的拓扑结构。首先令 $t_x = 1 - k_x - e_x$，把转移中那个 $\sum$ 中关于父亲结点的那一项提出来，并且把转移写成 $dp_x = a_x \cdot dp_1 + b_x \cdot dp_{\textit{fa}_x} + c_x$ 的形式，通过叶子结点没有儿子可以解方程，具体过程十分 dirty，参考其他博客。

写一下推导的方向，注意到我们只需要 dp_1 的值，所以我们只需要计算 a_1，c_1 即可。考虑叶子结点没有后继求得叶子结点的 a，b，c 并且经过艰难的推导得到 a_x，b_x，c_x 关于 a_y，b_y，c_y （y 是 x 的后继）的递推式即可。

```cpp
using db = double;
int n;
bsi<int> adj[1 << 14];
db k[1 << 14], e[1 << 14], t[1 << 14], a[1 << 14], b[1 << 14], c[1 << 14];
void clear() { rep(i, n) bsi<int>().swap(adj[i]); }
bool dfs(int x, int pa) {
  int d = int(adj[x].size());
  a[x] = k[x], b[x] = t[x] / d, c[x] = t[x];
  db sum = 0;
  for (auto y : adj[x])
    if (y != pa) {
      if (!dfs(y, x))
        return 0;
      a[x] += t[x] / d * a[y], c[x] += t[x] / d * c[y], sum += t[x] / d * b[y];
    }
  if (fabs(1 - sum) < 1e-9)
    return 0;
  a[x] /= 1 - sum, b[x] /= 1 - sum, c[x] /= 1 - sum;
  return 1;
}
void run(int runid) {
  int x, y;
  cin >> n;
  rep(n - 1) cin >> x >> y, adj[--x] += --y, adj[y] += x;
  rep(i, n) cin >> k[i] >> e[i], t[i] = 1 - (k[i] /= 100) - (e[i] /= 100);
  cout << "Case " << runid << ": ";
  if (!dfs(0, n) || fabs(1 - a[0]) < 1e-9)
    cout << "impossible\n";
  else
    cout << c[0] / (1 - a[0]) << "\n";
}
signed main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
  cout << fixed << setprecision(6);
  int tt, kase = 0;
  for (cin >> tt; tt--; clear())
    run(++kase);
}
```
    