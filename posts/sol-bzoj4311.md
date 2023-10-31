---
date: '2022-11-16'
title: 'Solution -「BZOJ 4311」向量'
category: 'Notes'
---

[link．](https://hydro.ac/d/bzoj/p/4311)

我发现 Hydro OJ 意外地好用，比 darkbzoj 高明．

考虑点积的几何意义：投影．可以发现答案就是用一根与询问向量正交的直线从沿询问向量方向无限远处向原点迫近，碰到的第一个向量就是答案．然后你会发现，如果把正交直线的方程写出来，然后解一下与集合内向量相碰撞的方程，就会得到一个结论，即询问的答案是 $\max {y \times (\frac{x}{y} \times x_i + y_i)}$，当然这个用点积的代数式可以直接得到，于是把每个向量看作一个一次函数，我们就可以自然地想到李超树来维护这个最值．
但是

但是李超树很难支持撤销，我们考虑把撤销转化掉．一般这样的题目都有类似 “降维” 的思想，而这种操作一般通过数据结构实现．我们对操作的时间轴建一棵标记永久化的线段树，叶子结点存对应操作的信息，非叶子结点没有需要维护的信息，只需要记录懒标即可．而这个懒标在这个题里面就是一棵李超树，这个东西叫线段树分治．

~~线段树分治又何尝不是一种树套树~~

还剩下一个问题，李超树查询点值是个小数，怎么操作？我们把需要查询的点值离散化，并在离散化后的值域上建李超树即可，并把一次函数的 $f(x)$ 改为 $f(g(x))$，其中 $g(x)$ 是离散化后的编号到真实值域的映射．

$O(n \log^2 n)$．

```cpp
#include <iomanip>
#include <iostream>
#include <algorithm>
using std::cin;
using std::cout;
#define rep(i,a,b) for (int i(a); i<=(b); ++i)
#define drep(i,b,a) for (int i(b); i>=(a); --i)

int k[200100], b[200100];
int Id[200100], cnt;
double dat[200100], ver[200100]; // vertical coordination

double eval(int i, int x) {
    if (i == 0) return -1e18;
    return k[i] * dat[x] + b[i];
}

#define mid ((l+r)/2)
int tr[4000100], tid, lch[4000100], rch[4000100];
int upd(int u, int id, int l = 1, int r = cnt) {
    if (!u) return tr[u = ++tid] = id, u;
    if (eval(tr[u], mid) < eval(id, mid)) std::swap(tr[u], id);
    if (l < r && k[tr[u]] > k[id]) lch[u] = upd(lch[u], id, l, mid);
    else if (l < r) rch[u] = upd(rch[u], id, mid+1, r);
    return u;
}
double qry(int u, int x, int l = 1, int r = cnt) {
    if (!u) return -1e18;
    else if (l == r) return eval(tr[u], x);
    else if (mid >= x) return std::max(eval(tr[u], x), qry(lch[u], x, l, mid));
    else return std::max(eval(tr[u], x), qry(rch[u], x, mid+1, r));
}
#undef mid

int q, rt[800100], st[200100], T;
struct request {
    int op, x, y;
} req[200100];

#define mid ((l+r)/2)
void mark(int qL, int qR, int u = 1, int l = 1, int r = q) {
    if (l > qR || r < qL) return;
    else if (l >= qL && r <= qR) rt[u] = upd(rt[u], qL);
    else mark(qL, qR, u*2, l, mid), mark(qL, qR, u*2+1, mid+1, r);
}
double qry2(int id, int u = 1, int l = 1, int r = q) {
    if (l == r) return qry(rt[u], Id[id]);
    else if (mid >= id) return std::max(qry(rt[u], Id[id]), qry2(id, u*2, l, mid));
    else return std::max(qry(rt[u], Id[id]), qry2(id, u*2+1, mid+1, r));
}
#undef mid

signed main() {
    std::ios::sync_with_stdio(0);
    cin.tie(0);
    cout << std::fixed;
    cout << std::setprecision(0);
    cin >> q;
    rep(i,1,q) {
        cin >> req[i].op >> req[i].x;
        if (req[i].op == 1) {
            cin >> req[i].y;
            k[i] = req[i].x, b[i] = req[i].y;
        } else if (req[i].op == 3) {
            cin >> req[i].y;
            ver[i] = dat[++cnt] = 1.0*req[i].x/req[i].y;
        }
    }
    std::sort(dat+1, dat+cnt+1);
    cnt = std::unique(dat+1, dat+cnt+1)-dat-1;
    rep(i,1,q) {
        if (req[i].op == 1) {
            st[++T] = i;
        } else if (req[i].op == 2) {
            mark(st[req[i].x], i), st[req[i].x] = 0;
        } else {
            Id[i] = std::lower_bound(dat+1, dat+cnt+1, ver[i])-dat;
        }
    }
    rep(i,1,T)
        if (st[i]) mark(st[i], q);
    int now = 0;
    rep(i,1,q) {
        if (req[i].op == 1) now++;
        else if (req[i].op == 2) now--;
        else if (now == 0) cout << "0\n";
        else cout << req[i].y*qry2(i) << "\n";
    }
}
```