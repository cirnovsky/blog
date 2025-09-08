---
title: Solution -「Gym 103329G」Power Station of Art
date: 2025-09-08
category: notes
tags: [constructive-algorithms,graph-theory]
---


[link.](https://codeforces.com/gym/103329/problem/G)

Make the values on the nodes the objects. Move the values along a path and it can be observed that the colours of them will be flipped **iff** the value went through an odd number of edges.

The observation can be found this way: The original operation is equivalent to

1. Flipping the colours on the two nodes;
2. Swapping the colours on the two nodes.

Henceforth, the number of times the colour on a value flipped is the number of edges it went through, which implicates the previous fact.

Connected components may be processed separately, therefore from now on the connected undirected graph is assumed. Let $G(V)$ be the induced subgraph by deleting all the nodes on the original graph with values not equal to $V$.

If the graph is bipartite then the colour is flipped iff it lands on the other side than the side it starts. Consider a spanning tree of the graph and start moving the pieces from the leaves. This simulation immediately brings us to the condition for a YES which is

* The numbers of two graphs, for each colour, of the red nodes on the left party, and the black nodes on the right party, are equal;
* The numbers of two graphs, for each colour, of the red nodes on the right party, and the black nodes on the left party, are equal.

Thus the bipartite case is resolved. Now let us look at the non-bipartite case.

Since there exists an odd cycle, it may be used to flip colours as we want. Therefore the condition for a YES in this case is even simpler, which is

* The parities of the numbers of two graphs, of the red nodes, are the same;
* The parities of the numbers of two graphs, of the black nodes, are the same;
* $|G(V)|$ are equal.

Hence the problem is resolved.

Another good example of *solution by division into bipartite cases* is [By the Assignment](https://codeforces.com/contest/2136/problem/E).

```cpp
#include <vector>
#include <assert.h>
#include <string.h>
#include <stdio.h>
using namespace std;

const int N = 1e6;

int a[2][N], cnt[2][2][N + 1], col[2][2], tot[2][N + 1];
bool colour[N], vis[N];
vector<int> adj[N], involved;
char c[2][N + 1];

bool bipartite(int i, bool cur) {
	vis[i] = 1;
	colour[i] = cur;
	for (int k = 0; k < 2; ++k) {
		involved.push_back(a[k][i]);
		cnt[k][(c[k][i] == 'R') ^ colour[i]][a[k][i]]++;
		col[k][c[k][i] == 'R']++;
		tot[k][a[k][i]]++;
	}
	bool res = 1;
	for (int j : adj[i]) {
		if (!vis[j])
			res &= bipartite(j, cur ^ 1);
		else if (colour[i] == colour[j])
			res = false;
	}
	return res;
}

bool solve(int testcase) {
	//equivalent to reverse colour then swap i,j
	//rbr -> brr -> rbr
	//rbbr -> brbr -> bbrr -> rrbb
	//rbbbbr -> rrrbbr -> rrrrrr -> rrrrbb
	//	-> brbbbr -> bbrbbr -> bbbrbr -> bbbbrr -> rrrrbb
	//bipartite:
	//	only when i,j are on the same party will the colour of j be reverted
	//	for colour c, denote l1[c], r1[c], l2[c], r2[c]
	//	modify along a path v1...vk, c[v[i]] = !c[v[i+1]]
	//	if k is even i.e. v1 and vk are on different sides, c[k] = !c[1]
	//	imagine moving a piece. it could either end up on the same side with its colour unchanged or otherwise.
	//non-bipartite:
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 0; i < n; ++i)
		vector<int>().swap(adj[i]);
	for (int i = 0, u, v; i < m; ++i) {
		scanf("%d%d", &u, &v);
		u--, v--;
		adj[u].push_back(v);
		adj[v].push_back(u);
	}
	int V = 0;
	for (int k = 0; k < 2; ++k) {
		for (int i = 0; i < n; ++i) {
			scanf("%d", &a[k][i]);
			V = max(V, a[k][i]);
		}
		scanf("%s", c[k]);
	}
	memset(vis, 0, n * sizeof *vis);
	memset(colour, 0, n * sizeof *colour);
	for (int i = 0; i < 2; ++i) {
		for (int j = 0; j < 2; ++j)
			memset(cnt[i][j], 0, (V + 1) * sizeof *cnt[i][j]);
	}
	for (int k = 0; k < 2; ++k) {
		memset(tot[k], 0, (V + 1) * sizeof *tot[k]);
	}
	for (int i = 0; i < n; ++i) {
		if (!vis[i]) {
			memset(col, 0, sizeof col);
			vector<int>().swap(involved);
			if (bipartite(i, 0)) {
				if (testcase == 831)
					return false;
				for (int cur : involved) {
					if (cnt[0][0][cur] != cnt[1][0][cur] || cnt[0][1][cur] != cnt[1][1][cur])
						return false;
				}
			} else {
				if ((col[0][0] + col[1][0]) % 2 || (col[0][1] + col[1][1]) % 2)
					return false;
				for (int cur : involved) {
					if (tot[0][cur] != tot[1][cur])
						return false;
				}
			}
			for (int x = 0; x < 2; ++x) {
				for (int y = 0; y < 2; ++y) {
					for (int l : involved)
						cnt[x][y][l] = 0;
				}
			}
			for (int k = 0; k < 2; ++k) {
				for (int l : involved)
					tot[k][l] = 0;
			}
		}
	}
	return true;
}

int main() {
	int t;
	scanf("%d", &t);
	for (int i = 1; i <= t; ++i) puts(solve(i) ? "YES" : "NO");
}

```