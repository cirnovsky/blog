---
date: '2022-11-03'
title: 'Solution -「NOI 2022」众数'
---

[link．](https://loj.ac/p/3847)

首先有一个很厉害的转换，某序列若存在题目中定义的中位数，则该数一定是该序列的中位数．感觉这一步挺神仙，我没想出来。这个是原题的必要条件，要做成充要只需要用数据结构检验该数的出现次数是否超过序列的模的一半．

具体到维护，使用链表维护所有链的形态，使用动态开点权值线段树维护每条链上各个数的出现次数即可．

```cpp
#include <list>
#include <cstdio>
#define rep(i,a,b) for (int i(a); i<=(b); ++i)
#define drep(i,b,a) for (int i(b); i>=(a); --i)

struct istream {
        istream& operator>>(int& n) {
            n = 0; char s = getchar(); while (s < '0' || s > '9') s = getchar();
        for (; s>='0'&&s<='9'; s=getchar()) n = n*10+s-48;
        return *this;
    }
} cin;

int n, q, m, rt[1000100], id[1000100];
std::list<int> ls[1000100];

long long sum[10500100];
int tid, lch[10500100], rch[10500100], now[1000100], rec[1000100];
#define mid ((l+r)>>1)
int upd(int u, int pos, int val, int l = 1, int r = n+q) {
        if (!u) u = ++tid;
    sum[u] += val;
    if (l < r && mid >= pos) lch[u] = upd(lch[u], pos, val, l, mid);
    else if (l < r) rch[u] = upd(rch[u], pos, val, mid+1, r);
    return u;
}
int mrg(int u, int v, int l = 1, int r = n+q) {
        if (!u || !v) return u+v;
    sum[u] += sum[v];
    lch[u] = mrg(lch[u], lch[v], l, mid);
    rch[u] = mrg(rch[u], rch[v], mid+1, r);
    return u;
}
long long qry(int u, int val, int l = 1, int r = n+q) {
        if (!u) return 0;
    else if (l == r) return sum[u];
    else if (mid >= val) return qry(lch[u], val, l, mid);
    else return qry(rch[u], val, mid+1, r);
}
int bisect(long long pos, int l = 1, int r = n+q) {
        if (l == r) return l;
    long long t = 0;
    rep(i,1,m) t += sum[lch[now[i]]];
    if (t >= pos) {
            rep(i,1,m) now[i] = lch[now[i]];
        return bisect(pos, l, mid);
    } else {
            rep(i,1,m) now[i] = rch[now[i]];
        return bisect(pos, mid+1, r);
    }
}
#undef mid

signed main() {
        cin >> n >> q;
    rep(i,1,n+q) id[i] = i;
    for (int i=1,l,x; i<=n; ++i) {
            cin >> l;
        rep(j,1,l) {
                cin >> x;
            rt[i] = upd(rt[i], x, 1);
            ls[id[i]].push_back(x);
        }
    }
    for (int op,x,y,z,Q=q; Q--;) {
            cin >> op >> x;
        if (op == 1) {
                cin >> y;
            ls[id[x]].push_back(y);
            rt[x] = upd(rt[x], y, 1);
        } else if (op == 2) {
                rt[x] = upd(rt[x], ls[id[x]].back(), -1);
            ls[id[x]].pop_back();
        } else if (op == 3) {
                long long U = 0, S = 0;
            m = x;
            rep(i,1,m) {
                    cin >> y;
                now[i] = rec[i] = rt[y];
                U += ls[id[y]].size();
            }
            int M = bisect((U+1)/2);
            rep(i,1,m) S += qry(rec[i], M);
            if (S*2 > U) printf("%dn", M);
            else puts("-1");
        } else { // append @x at the tail of @y
            cin >> y >> z;
            std::swap(x, y);
            rt[z] = mrg(rt[x], rt[y]);
            if (ls[id[x]].size() < ls[id[y]].size()) {
                    while (!ls[id[x]].empty())
                    ls[id[y]].push_back(ls[id[x]].front()), ls[id[x]].pop_front();
                id[z] = id[y];
            } else {
                    while (!ls[id[y]].empty())
                    ls[id[x]].push_front(ls[id[y]].back()), ls[id[y]].pop_back();
                id[z] = id[x];
            }
        }
    }
}
```