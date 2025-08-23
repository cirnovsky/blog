---
date: 2022-01-06
title: 费用流去掉负权边
category: notes
tags: [flows]
---

消去网络中负权边的方法。

首先不能给边势能函数，因为最短路的路径不一定一致。于是在点上做文章，给每个点一个势能函数 $h(x)$，满足 $\forall (x,y)\in E,s.t.h(x)-h(y)+w(x,y)\geqslant0$，这样跑出来的最短路多的权就是 $h(s)-h(t)$。

至于构造方法，每次增广完以后，如果 $(x,y)\in E_r$，则 $y$ 一定是 $x$ 的 successor（不然就不在增广路上），也就是说 $d_x+w(x,y)+h(x)-h(y)=d_y$，其中 $d$ 是 $s$ 到该点的最短路，可得 $(d_y+h(y))-(d_x+h(x))=w(x,y)$。

那么令 $h(x):=h(x)+d(x)$ 即可。

因为不想写指针所以用了 `std::vector` 管理边的内存……

<details>

<summary>TS; DR</summary>

```cpp
template<typename type1, typename type2,
    const type1 inf1 = std::numeric_limits<type1>::max(),
    const type2 inf2 = std::numeric_limits<type2>::max()>
struct mcf_graph {
    const int n;
    struct edge {
        int to, nxt;
        type1 c; type2 f;
        edge(int to, int nxt, type1 c, type2 f) : to(to), nxt(nxt), c(c), f(f) {}
    };
    int *head, *pre, *id, *vis;
    std::vector<edge> e;
    type2 *h, *dis;
    mcf_graph(const int n) : n(n),
        head(new int[n+1]), pre(new int[n+1]), id(new int[n+1]), vis(new int[n+1]),
        h(new type2[n+1]), dis(new type2[n+1]) { std::memset(head, -1, (n+1)<<2); }
    void add_edge(const int x, const int y, type1 c, type2 f) {
        assert(1 <= x && x <= n && 1 <= y && y <= n);
        e.emplace_back(y, head[x], c, f),head[x] = int(e.size())-1;
        e.emplace_back(x, head[y], 0, -f),head[y] = int(e.size())-1;
    }
    void initialize_potentials(const int s) {
        std::queue<int> q;
        std::fill(h+1, h+n+1, inf2);
        std::memset(vis+1, 0, n<<2);
        for(q.push(s), vis[s] = 1, h[s] = 0; q.size(); vis[q.front()] = 0, q.pop()) {
            for(int now = q.front(), i = head[now], y; ~i; i = e[i].nxt) {
                if(e[i].c && (h[y = e[i].to] == inf2 || h[y] > h[now]+e[i].f)) {
                    h[y] = h[now]+e[i].f;
                    if(!vis[y]) q.push(y),vis[y] = 1;
                }
            }
        }
    }
    bool augment(const int s, const int t) {
        std::priority_queue<std::pair<type2, int>, std::vector<std::pair<type2, int>>, std::greater<std::pair<type2, int>>> q;
        std::fill(dis+1, dis+n+1, inf2);
        std::memset(vis+1, 0, n<<2);
        for(q.emplace(dis[s] = 0, s); q.size();) {
            int now = q.top().second;
            q.pop();
            if(vis[now]) continue;
            vis[now] = 1;
            for(int i = head[now], y; ~i; i = e[i].nxt) {
                if(e[i].c && (dis[y = e[i].to] == inf2 || dis[y] > dis[now]+e[i].f+h[now]-h[y])) {
                    dis[y] = dis[now]+e[i].f+h[now]-h[y];
                    pre[y] = now,id[y] = i;
                    if(!vis[y]) q.emplace(dis[y], y);
                }
            }
        }
        return dis[t] < inf2;
    }
    std::pair<type1, type2> get(const int s, const int t) {
        assert(1 <= s && s <= n && 1 <= t && t <= n);
        type1 res1 = 0; type2 res2 = 0;
        initialize_potentials(s);
        while(augment(s, t)) {
            type1 cur = inf1;
            for(int i = 1; i <= n; ++i) h[i] += dis[i];
            for(int i = t; i != s; i = pre[i]) cmin(cur, e[id[i]].c);
            for(int i = t; i != s; i = pre[i]) e[id[i]].c -= cur,e[id[i]^1].c += cur;
            res1 += cur,res2 += cur*h[t];
        }
        return std::make_pair(res1, res2);
    }
};
```

</details>

现在来看一年前的傻逼代码太丑了，换了个好看的：

```cpp
template <class Cap, class Cost>
struct mcf_graph {
  using pcc = pair<Cap, Cost>;
  struct edge {
    int v, rv;
    Cap c;
    Cost w;
  };
  const int _n;
  vi<vi<edge>> e;
  mcf_graph() : mcf_graph(0) {}
  explicit mcf_graph(int n) : _n(n), e(n + 1) {}
  void add_edge(int from, int to, const Cap& c, const Cost& w) {
    assert(1 <= from && from <= _n);
    assert(1 <= to && to <= _n);
    e[from].pb({to, int(e[to].size()) + (from == to), c, w});
    e[to].pb({from, int(e[from].size()) - 1, 0, -w});
  }
  pcc flow(int s, int t) {
    assert(1 <= s && s <= _n);
    assert(1 <= t && t <= _n);
    return flow(s, t, numeric_limits<Cap>::max(), numeric_limits<Cost>::max());
  }
  pcc flow(int s, int t, const Cap& flow_limit, const Cost& cost_limit) {
    vi<Cost> h(_n + 1, cost_limit), dst(_n + 1, cost_limit);
    vi<bool> vis(_n + 1);
    vi<int> pre(_n + 1), id(_n + 1);
    auto dual = [&](int s) {
      queue<int> que;
      for (que.push(s), h[s] = 0, vis[s] = 1; !que.empty();
           vis[que.front()] = 0, que.pop())
        for (int x = que.front(), i = 0, y; i < int(e[x].size()); ++i)
          if (e[x][i].c && h[y = e[x][i].v] > h[x] + e[x][i].w) {
            h[y] = h[x] + e[x][i].w;
            if (!vis[y]) que.push(y), vis[y] = 1;
          }
    };
    auto aug = [&](int s, int t) {
      using pci = pair<Cost, int>;
      priority_queue<pci, vi<pci>, greater<pci>> que;
      dst.assign(_n + 1, cost_limit);
      vis.assign(_n + 1, 0);
      for (que.emplace(dst[s] = 0, s); !que.empty();) {
        int x = que.top().second;
        que.pop();
        if (!vis[x]) {
          vis[x] = 1;
          for (int i = 0, y; i < int(e[x].size()); ++i) {
            y = e[x][i].v;
            if (e[x][i].c && dst[y] > dst[x] + e[x][i].w - h[y] + h[x]) {
              dst[y] = dst[x] + e[x][i].w + h[x] - h[y];
              pre[y] = x, id[y] = i;
              if (!vis[y]) que.emplace(dst[y], y);
            }
          }
        }
      }
      return dst[t] < cost_limit;
    };
    Cap flow = 0;
    Cost cost = 0;
    dual(s);
    while (aug(s, t)) {
      Cap cur = flow_limit;
      for (int i = 1; i <= _n; ++i) h[i] += dst[i];
      for (int u = t; u != s; u = pre[u]) cmin(cur, e[pre[u]][id[u]].c);
      for (int u = t; u != s; u = pre[u])
        e[pre[u]][id[u]].c -= cur, e[u][e[pre[u]][id[u]].rv].c += cur;
      flow += cur, cost += cur * h[t];
    }
    return pcc(flow, cost);
  }
};
```
    