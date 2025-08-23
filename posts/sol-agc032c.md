---
date: 2022-09-11
title: 「atcoder - agc032c」Three Circuits
category: notes
tags: [graph-theory]
---

[link。](https://atcoder.jp/contests/agc032/tasks/agc032_c)

首先这个图是一个欧拉图，所以所有度数都是偶数。然后证明一个重要的结论：当有一个结点的度数 >= 6 时一定可行。你考虑所有度数都是偶数，所以菊花图卡不掉，因此是对的。

那么现在度数只有 2、4 两中情况，如果 4-degree 的结点个数 <= 1 的话一定不行，若 > 2 则一定可行，讨论 = 2 的情况。我们需要满足两个 4-degree 的结点所拉出来的 circuits 之间不能有「横叉边」，跑 dfs 判一下即可。

```cpp
int n, m, deg[1 << 17], x, y, typ[1 << 17];
bsi<int> adj[1 << 17];
void dfs(int u) {
  typ[u] = 1;
  for (auto v : adj[u]) {
    if (typ[v] == 2)
      (!x ? x : y) = v;
    else if (typ[v] == 0)
      dfs(v);
  }
}
signed main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
  cin >> n >> m;
  rep(m) cin >> x >> y, x--, y--, adj[x] += y, adj[y] += x, deg[x]++, deg[y]++;
  rep(i, n) cout << " " << deg[i] << "\n";
  if (count_if(deg, deg + n, [&](int x) { return x % 2 == 1; }) > 0)
    cout << "No\n";
  else if (*max_element(deg, deg + n) >= 6)
    cout << "Yes\n";
  else if (count(deg, deg + n, 4) > 2)
    cout << "Yes\n";
  else if (count(deg, deg + n, 4) <= 1)
    cout << "No\n";
  else {
    rep(i, n) if (deg[i] == 4) typ[i] = 2;
    rep(i, n) if (!typ[i]) {
      x = y = 0, dfs(i);
      if (x == y) {
        cout << "Yes\n";
        return 0;
      }
    }
    cout << "No\n";
  }
}
```
    