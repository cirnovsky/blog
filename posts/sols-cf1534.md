---
date: 2021-06-18
title: Solution Set -「CF 1534」
category: notes
tags: [graph-theory,combinatorics,brute-force]
---

> 这 1+2？

# 「CF1534 A」Colour the Flag

[Link](https://codeforces.com/contest/1534/problem/A).

把 `W` / `R` 拉出来广搜，注意判断全空的情况。

<details>

```cpp
#include <bits/stdc++.h>
using ll = long long;
#define all(x) (x).begin(), (x).end()
int main() {
	std::ios_base::sync_with_stdio(false);
	std::cin.tie(nullptr);
	std::cout.tie(nullptr);
	int T, n, m;
	std::vector<std::vector<int>> DIR({{1, 0}, {0, 1}, {-1, 0}, {0, -1}});
	for (std::cin >> T; T; --T) {
		std::cin >> n >> m;
		std::vector<std::vector<char>> a(n, std::vector<char>(m));
		std::vector<std::vector<bool>> vis(n, std::vector<bool>(m));
		std::queue<std::pair<int, int>> que;
		for (int i = 0; i < n; ++i) {
			for (int j = 0; j < m; ++j) {
				std::cin >> a[i][j];
				if (a[i][j] != '.') {
					que.emplace(i, j);
					vis[i][j] = true;
				}
			}
		}
		if (que.empty()) {
			a[0][0] = 'R';
			que.emplace(0, 0);
			vis[0][0] = true;
		}
		auto check = [&] (std::pair<int, int> x) {
			return x.first < 0 || x.first >= n || x.second < 0 || x.second >= m;
		};
		bool flag = 0;
		while (!que.empty()) {
			auto x = que.front();
			que.pop();
			for (auto d : DIR) {
				auto y = std::make_pair(x.first + d[0], x.second + d[1]);
				if (check(y)) continue;
				if (a[x.first][x.second] == a[y.first][y.second]) {
					flag = true;
					break;
				}
				if (vis[y.first][y.second]) continue;
				vis[y.first][y.second] = true;
				if (a[y.first][y.second] == '.') {
					if (a[x.first][x.second] == 'R') a[y.first][y.second] = 'W';
					else a[y.first][y.second] = 'R';
				}
				que.emplace(y);
			}
			if (flag) break;
		}
		if (flag) std::cout << "No\n";
		else {
			std::cout << "Yes\n";
			for (auto x : a) {
				for (auto y : x) std::cout << y;
				std::cout << "\n";
			}
		}
	}
	return 0;
}
```

</details>

# 「CF1534 B」Histogram Ugliness

[Link](https://codeforces.com/contest/1534/problem/B).

我们只会对比 $i+1$ & $i-1$ 都高 $i$ 进行操作，然后答案显然。 

<details>

```cpp
#include <bits/stdc++.h>
using ll = long long;
#define all(x) (x).begin(), (x).end()
int main() {
	std::ios_base::sync_with_stdio(false);
	std::cin.tie(nullptr);
	std::cout.tie(nullptr);
	int T, n;
	for (std::cin >> T; T; --T) {
		std::cin >> n;
		std::vector<int> a(n);
		for (int &x : a) std::cin >> x;
		a.emplace(a.begin(), 0);
		a.emplace_back(0);
		ll ans = 0;
		for (int i = 1; i <= n + 1; ++i) ans += std::abs(a[i] - a[i - 1]);
		for (int i = 1; i <= n; ++i) {
			if (a[i] > std::max(a[i - 1], a[i + 1])) {
				ans -= a[i] - std::max(a[i - 1], a[i + 1]);
				a[i] = std::max(a[i - 1], a[i + 1]);
			}
		}
		std::cout << ans << "\n";
	}
	return 0;
}
```

</details>

# 「CF1534 C」Little Alawn's Puzzle

[Link](https://codeforces.com/contest/1534/problem/C).

钦定研究第一行。考虑 $i$ 这个下标，我们对在第二行的 $i$ 连个边，同时对在第二行的 $p_{i}$ 的所在下标连边。

然后数出图里面有多少环，答案就是 $2$ 的环数量次方。

<details>

```cpp
#include <bits/stdc++.h>
using ll = long long;
#define all(x) (x).begin(), (x).end()
int main() {
	std::ios_base::sync_with_stdio(false);
	std::cin.tie(nullptr);
	std::cout.tie(nullptr);
	int T, n;
	for (std::cin >> T; T; --T) {
		std::cin >> n;
		std::vector<std::vector<int>> a(2, std::vector<int>(n)), idx(2, std::vector<int>(n));
		int cur = 0;
		for (int &x : a[0]) {
			std::cin >> x;
			--x;
			idx[0][x] = cur++;
		}
		for (int &x : a[1]) {
			std::cin >> x;
			--x;
			idx[1][x] = cur++;
		}
		bool flag = false;
		for (int i = 0; i < n; ++i) {
			if (a[0][i] == a[1][i]) {
				flag = true;
				break;
			}
		}
		if (flag) {
			std::cout << "0\n";
			continue;
		}
		std::vector<int> fa(n * 2);
		std::iota(all(fa), 0);
		auto find = [&] (int x) {
			while (fa[x] != x) {
				x = fa[x] = fa[fa[x]];
			}
			return x;
		};
		auto merge = [&] (int x, int y) {
			x = find(x);
			y = find(y);
			fa[x] = y;
		};
		for (int i = 0; i < n; ++i) {
			merge(i, i + n);
			merge(idx[0][a[0][i]], idx[1][a[0][i]]);
		}
		int num = 0;
		for (int i = 0; i < n * 2; ++i) {
			if (fa[i] == i) ++num;
		}
		constexpr int P = 1e9 + 7;
		auto power = [&] (int x, int y) {
			int res = 1;
			for (; y; y >>= 1, x = ll(x) * x % P)
				if (y & 1) res = ll(res) * x % P;
			return (res + P) % P;
		};
		std::cout << power(2, num) << "\n";
	}
	return 0;
}
```

</details>

# 「CF1534 D」Lost Tree

[Link](https://codeforces.com/contest/1534/problem/D).

首先肯定要钦定一个根，对其进行一次询问。

然后查询出来的相当于是深度。观察次数限制 $\lceil\frac{n}{2}\rceil$，大概是一半的节点。

考虑如何规划一半的节点去询问。一次询问能确定的边就是查询出来距离为 $1$ 的。

~~注意到相邻奇数偶数之间总是相差 $1$。~~

然后把节点进行关于深度的奇偶分层，查询 奇 / 偶 中数量较少的节点即可。

<details>

```cpp
#include <bits/stdc++.h>
using ll = long long;
#define all(x) (x).begin(), (x).end()
int main() {
//	std::ios_base::sync_with_stdio(false);
//	std::cin.tie(nullptr);
//	std::cout.tie(nullptr);
	int n;
	std::cin >> n;
	auto ask = [&] (int x) {
		std::cout << "? " << x + 1 << "\n";
		std::vector<int> res(n);
		for (int &x : res) std::cin >> x;
		return res;
	};
	std::vector<int> d = ask(0);
	std::vector<std::pair<int, int>> ans;
	std::vector<std::vector<int>> cat(2);
	for (int i = 0; i < n; ++i) {
		if (d[i] == 1) ans.emplace_back(std::make_pair(0, i));
	}
	for (int i = 1; i < n; ++i) {
		if (d[i] & 1) cat[1].emplace_back(i);
		else cat[0].emplace_back(i);
	}
	std::vector<int> point;
	if (cat[0].size() > cat[1].size()) point = cat[1];
	else point = cat[0];
	for (int x : point) {
		d = ask(x);
		for (int i = 0; i < n; ++i) {
			if (d[i] == 1) ans.emplace_back(std::make_pair(x, i));
		}
	}
	for (auto &x : ans) {
		if (x.first > x.second) std::swap(x.first, x.second);
	}
	std::sort(all(ans));
	ans.erase(std::unique(all(ans)), ans.end());
	std::cout << "!\n";
	for (auto x : ans) std::cout << x.first + 1 << " " << x.second + 1 << "\n";
	return 0;
}
```

</details>

# 「CF1534 E」Lost Array

[Link](https://codeforces.com/contest/1534/problem/E).

将询问的次数看作一个状态，我们考虑它每次往哪里跑。

如果我们想知道新的 $\texttt{XOR}$ 和可以选择全部查没选过的也可以部分选择。

那么就可以做了，因为 $k$ 很小，BFS 搜即可。

<details>

```cpp
#include <bits/stdc++.h>
using ll = long long;
#define all(x) (x).begin(), (x).end()
int main() {
//	std::ios_base::sync_with_stdio(false);
//	std::cin.tie(nullptr);
//	std::cout.tie(nullptr);
	constexpr int INF = std::numeric_limits<int>::max() / 2;
	int n, k;
	std::cin >> n >> k;
	auto ask = [&] (std::vector<int> v) {
		std::cout << "?";
		for (int x : v) std::cout << " " << x + 1;
		std::cout << "\n";
		int res;
		std::cin >> res;
		return res;
	};
	auto link = [&] (std::vector<int> a, std::vector<int> b) {
		std::vector<int> v;
		for (int x : a) v.emplace_back(x);
		for (int x : b) v.emplace_back(x);
		return v;
	};
	std::vector<int> pre(n + 1, 0), dis(n + 1, INF);
	std::queue<int> que;
	pre[0] = -1;
	dis[0] = 0;
	que.emplace(0);
	while (!que.empty()) {
		int x = que.front();
		que.pop();
		for (int i = 1; i <= k; ++i) {
			if (i <= n - x && k - i <= x) {
				int y = x + i * 2 - k;
				if (dis[y] == INF) {
					dis[y] = dis[x] + 1;
					pre[y] = x;
					que.emplace(y);
				}
			}
		}
	}
	if (dis[n] == INF) {
		std::cout << "-1\n";
		return 0;
	}
	std::vector<int> t, f(n), p;
	for (int i = n; ~i; i = pre[i]) p.emplace_back(i);
	std::reverse(all(p));
	int ans = 0;
	std::iota(all(f), 0);
	for (size_t i = 0; i < p.size() - 1; ++i) {
		int x = (p[i + 1] - p[i] + k) / 2, y = k - x;
		std::vector<int> mt, mf;
		for (int j = 0; j < x; ++j) {
			mt.emplace_back(f.back());
			f.pop_back();
		}
		for (int j = 0; j < y; ++j) {
			mf.emplace_back(t.back());
			t.pop_back();
		}
		ans ^= ask(link(mt, mf));
		t.insert(t.end(), all(mt));
		f.insert(f.end(), all(mf));
	}
	std::cout << "! " << ans << "\n";
	return 0;
}
```

</details>

# 「CF1534 F1」Falling Sand (Easy Version)

[Link](https://codeforces.com/contest/1534/problem/F1).

考虑将一块沙块向其能影响到的沙块连有向边。

具体来讲，我们设 $\textit{last}(i,j)$ 为第 $i$ 行第 $j$ 列往下望见的第一个沙块，若没有则设为 $-1$。然后连边方式就是（研究 $(i,j)$）：

1. 首先 $(i,j)$ 本身是沙块；
2. 向 $\textit{last}(i,j)$ 连边（如果存在，下同）；
3. 若 $(i,j+1)$ 存在，则连 $(i,j+1)$，否则连 $\textit{last}(i,j+1)$；
4. $(i,j-1)$ 同理。

连出来一张图，你可能觉得这张图里面所有出度为 $0$ 的就是答案，实则需要缩个点，然后才成立（样例 #2 就能 hack 非常良心）。

<details>

```cpp
#include <bits/stdc++.h>
using ll = long long;
#define all(x) (x).begin(), (x).end()
int main() {
	std::ios_base::sync_with_stdio(false);
	std::cin.tie(nullptr);
	std::cout.tie(nullptr);
	int n, m, cnt = 0;
	std::cin >> n >> m;
	std::vector<std::vector<char>> a(n, std::vector<char>(m));
	std::vector<std::vector<int>> last(n, std::vector<int>(m)), id = last;
	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j) {
			std::cin >> a[i][j];
			if (a[i][j] == '#') id[i][j] = cnt++;
		}
	}
	for (int j = 0; j < m; ++j) {
		int pos = -1;
		for (int i = n - 1; ~i; --i) {
			last[i][j] = pos;
			if (a[i][j] == '#') pos = i;
		}
	}
	int col = 0, tot = 0;
	std::vector<std::pair<int, int>> edgeSet;
	std::vector<std::vector<int>> e(cnt);
	std::vector<int> color(cnt), order(cnt), low(cnt);
	std::vector<bool> inStk(cnt);
	std::stack<int> stk;
	auto add = [&] (int x, int y) {
		e[x].emplace_back(y);
		edgeSet.emplace_back(std::make_pair(x, y));
	};
	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j) {
			if (a[i][j] == '#') {
				if (j < m - 1) {
					if (a[i][j + 1] == '#') add(id[i][j], id[i][j + 1]);
					else if (~last[i][j + 1]) add(id[i][j], id[last[i][j + 1]][j + 1]);
				}
				if (j > 0) {
					if (a[i][j - 1] == '#') add(id[i][j], id[i][j - 1]);
					if (~last[i][j - 1]) add(id[i][j], id[last[i][j - 1]][j - 1]);
				}
				if(~last[i][j]) add(id[i][j], id[last[i][j]][j]);
				if (i > 0) {
					if (a[i - 1][j] == '#') add(id[i][j], id[i - 1][j]);
				}
			}
		}
	}
	std::function<void(int)> compress = [&] (int x) {
		order[x] = low[x] = tot++;
		inStk[x] = true;
		stk.emplace(x);
		for (int y : e[x]) {
			if (!order[y]) {
				compress(y);
				low[x] = std::min(low[x], low[y]);
			}
			else if (inStk[y]) low[x] = std::min(low[x], order[y]);
		}
		if (order[x] == low[x]) {
			int y = 0;
			++col;
			while (x != y) {
				y = stk.top();
				stk.pop();
				color[y] = col;
				inStk[y] = false;
			}
		}
	};
	for (int i = 0; i < cnt; ++i) {
		if (!order[i]) compress(i);
	}
	std::vector<int> deg(col);
	for (std::pair<int, int> edge : edgeSet) {
		if (color[edge.first] != color[edge.second]) ++deg[color[edge.second]];
	}
	std::cout << std::count(all(deg), 0) << "\n";
	return 0;
}
```

</details>

# 「CF1534 F2」Falling Sand (Hard Version)

[Link](https://codeforces.com/contest/1534/problem/F2).

<details>

```cpp

```

</details>

# 「CF1534 G」A New Beginning

[Link](https://codeforces.com/contest/1534/problem/G).

<details>

```cpp

```

</details>

# 「CF1534 H」Lost Nodes

[Link](https://codeforces.com/contest/1534/problem/H).

<details>

```cpp

```

</details>
    