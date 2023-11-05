---
date: '2022-08-14'
title: 'Solution -「CF 888G」Xor-MST'

---

给一种不一样的写法，避开了常数较大的函数式字典树 ~~并获得了更大的其他常数~~。

考虑 Borůvka 的过程：每次找到一个连通块到其他连通块最小的出边并合并连通块，复杂度分析同启发式合并。我们只需要考虑怎么求「一个连通块到外部的最小出边」即可。

我们维护一棵全局的字典树，在查询连通块 $S$ 的最小出边时删除 $S$ 中的点后查询异或最小值即可。

对于字典树的删除操作，我们可以对于字典树上的结点记录 parent node，然后删除的时候从叶子开始跳 parent 打删除标记即可。

注意删除操作必须通过打标记来实现而不是直接将后继结点的指针清空，因为这样会带来额外一个 $O(\log)$ 的空间开销。还有些细节参考给出的实现。

```cpp[class="line-numbers"]
int n, a[200100], _tot, pos[200100], bits;
struct node {
  int fa, son[2], cnt, id;
  bool del[2];
} t[6000100];
void ins(int val, int id) {
  int now = 0;
  for (int i = bits; i >= 0; --i) {
    if (!t[now].son[(val>>i)&1]) t[now].son[(val>>i)&1] = ++_tot;
    if (t[now].del[(val>>i)&1]) t[now].del[(val>>i)&1] = 0;
    t[t[now].son[(val>>i)&1]].fa = now, t[now].cnt++;
    now = t[now].son[(val>>i)&1];
  }
  t[now].id = id, t[now].cnt++, pos[id] = now;
}
void del(int id) {
  for (int now = pos[id]; now; now = t[now].fa) {
    if (--t[now].cnt == 0) t[t[now].fa].del[t[t[now].fa].son[1] == now] = 1;
  }
}
int Id;
int qry(int val) {
  int res = 0, now = 0;
  for (int i = bits; i >= 0; --i) {
    if (t[now].son[(val>>i)&1] && !t[now].del[(val>>i)&1]) now = t[now].son[(val>>i)&1];
    else {
      res += 1<<i, now = t[now].son[~(val>>i)&1];
    }
  }
  Id = t[now].id;
  return res;
}
int ust[200100];
int ldr(int x) {
  while (x != ust[x]) x = ust[x] = ust[ust[x]];
  return x;
}
int rec[200100], _min[200100], to[200100];
bsi<int> cc[200100];
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
  cin >> n;
  for (int i = 1; i <= n; ++i) {
    cin >> a[i], cmax(bits, (int)ceil(log2(a[i])));
  }
  sort(a+1, a+n+1);
  n = unique(a+1, a+n+1)-a-1;
  for (int i = 1; i <= n; ++i) ins(a[i], i);
  iota(ust+1, ust+n+1, 1);
  ll ans = 0;
  for (int num = n; num > 1;) {
    int tot = 0;
    for (int i = 1; i <= n; ++i) {
      if (cc[ldr(i)].empty()) rec[++tot] = ldr(i);
      cc[ldr(i)] += i;
    }
    for (int i = 1; i <= tot; ++i) _min[i] = to[i] = -1;
    for (int i = 1; i <= tot; ++i) {
      for (auto id : cc[rec[i]]) del(id);
      for (auto id : cc[rec[i]]) {
        int ret = qry(a[id]);
        if (_min[i] == -1 || _min[i] > ret) _min[i] = ret, to[i] = Id;
      }
      for (auto id : cc[rec[i]]) ins(a[id], id);
    }
    for (int i = 1; i <= tot; ++i) {
      if (ldr(to[i]) != rec[i]) ans += _min[i], ust[rec[i]] = ldr(to[i]), num--;
    }
    for (int i = 1; i <= tot; ++i) bsi<int>().swap(cc[rec[i]]);
  }
  cout << ans << "\n";
}

```