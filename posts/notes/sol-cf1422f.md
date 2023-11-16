---
date: '2022-11-02'
title: 'Solution -「CF 1422F」Boring Queries'
---

[link。](https://codeforces.com/problemset/problem/1422/F)

这篇题解比较随便。

基本是个一眼题，但是数组开小调了很久，主席树就只能造极限数据猜空间吗，，，，

反正，大于根号的就一个，跑个 hh 的项链，小于根号就那么几个，开个 ST 表维护极值就好。

```cpp
#include <cassert>
#include <cstdio>
#include <algorithm>
#define rep(i,a,b) for (int i(a); i<=(b); ++i)
#define rep_(i,a,b) for (int i(a); i<(b); ++i)
#define drep(i,b,a) for (int i(b); i>=(a); --i)
inline int rint() {
        int n(0),f(1);char s=getchar();for(;s<'0'||s>'9';s=getchar())if(s=='-')f=-1;for(;s>='0'&&s<='9';s=getchar())n=n*10+s-48;return n*f;
}

const int kMaxN = 100100;
const int kMaxS = 6400100;
const int kMaxP = 87;
const int mod = 1e9+7;
const int pn[kMaxP] = {
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
    31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
    127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
    179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
    233, 239, 241, 251, 257, 263, 269, 271, 277, 281,
    283, 293, 307, 311, 313, 317, 331, 337, 347, 349,
    353, 359, 367, 373, 379, 383, 389, 397, 401, 409,
    419, 421, 431, 433, 439, 443, 449
};
int n, a[kMaxN], lgs[kMaxN], pre[2*kMaxN], rt[kMaxN];

int pow(int n, int m) {
        int z(1);
    for (; m; m>>=1,n=1ll*n*n%mod)
        if (m&1) z = 1ll*z*n%mod;
    return z;
}
int inv(int n) {
        return pow(n, mod-2);
}

struct sparse_table {
        short f[20][kMaxN];
    void dp(int n) {
            rep(i,1,19)
            rep(j,1,n)
                f[i][j] = std::max(f[i-1][j], f[i-1][j+(1<<i-1)]);
    }
    int qry(int l, int r) {
            int k = lgs[r-l+1];
        return std::max(f[k][l], f[k][r-(1<<k)+1]);
    }
} tab[kMaxP];


struct segment_tree {
    #define mid ((l+r)/2)
    int ls[kMaxS], rs[kMaxS], mul[kMaxS], tid;
    void build(int& p, int l, int r) {
            mul[p = ++tid] = 1;
        if (l != r) build(ls[p], l, mid), build(rs[p], mid+1, r);
    }
    void mdf(int pos, int val, int& p) { mdf(pos, val, p, 1, n); }
    void mdf(int pos, int val, int& p, int l, int r) {
            ls[++tid] = ls[p], rs[tid] = rs[p], mul[tid] = 1ll*mul[p]*val%mod;
        p = tid;
        if (l != r) {
                if (mid >= pos) mdf(pos, val, ls[p], l, mid);
            else mdf(pos, val, rs[p], mid+1, r);
        }
    }
    int qry(int l, int r, int p) { return qry(l, r, p, 1, n); }
    int qry(int qL, int qR, int p, int l, int r) {
            if (!p || l > qR || r < qL) return 1;
        else if (l >= qL && r <= qR) return mul[p];
        return 1ll*qry(qL, qR, ls[p], l, mid)*qry(qL, qR, rs[p], mid+1, r)%mod;
    }
#undef mid
} sgt;

void handle(int pos) {
        for (int i=0; i<kMaxP&&pn[i]<=a[pos]; ++i)
        for (; a[pos]%pn[i] == 0; a[pos]/=pn[i]) tab[i].f[0][pos]++;
}

signed main() {
    #ifdef cirnovsky
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
#endif
    rep_(i,2,kMaxN)
        lgs[i] = lgs[i/2]+1;
    n = rint();
    sgt.build(rt[0], 1, n);
    rep(i,1,n) a[i] = rint();
    rep(i,1,n) handle(i);
    rep_(i,0,kMaxP) tab[i].dp(n);
    rep(i,1,n) {
        rt[i] = rt[i-1];
        if (pre[a[i]]) sgt.mdf(pre[a[i]], inv(a[i]), rt[i]);
        sgt.mdf(i, a[i], rt[i]);
        pre[a[i]] = i;
    }
    int q = rint();
    for (int l,r,ans=0; q--;) {
        l = (rint()+ans)%n+1, r = (rint()+ans)%n+1;
        if (l > r) std::swap(l, r);
        ans = 1ll*sgt.qry(l, r, rt[r])*inv(sgt.qry(l, r, rt[l-1]))%mod;
        rep_(i,0,kMaxP)
            ans = 1ll*ans*pow(pn[i], tab[i].qry(l, r))%mod;
        printf("%d\\n", ans);
        }
    }
```