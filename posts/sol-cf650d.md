---
date: 2022-09-10
title: 「codeforces - 650D」Zip-line
category: notes
tags: [data-structures]
---

[link。](http://codeforces.com/problemset/problem/650/D)

兔兔弹性的因。

考虑一次修改产生的影响，求出前缀 lis 长度和后缀 lis 长度，然后一个一个一个一个。

```cpp
struct seg_tree {
    int ms, mh;
    vi<int> md;
    seg_tree(int _n) {
        mh = ceil(log2(_n)), ms = 1<<mh;
        md = vi<int>(ms*2, 0);
    }
    void upd(int now) { md[now] = max(md[now*2], md[now*2+1]); }
    void mdf(int now, int val) {
        md[now += ms] = val;
        for (int i=1; i<=mh; ++i) upd(now>>i);
    }
    int qry(int pos) { return md[pos+ms]; }
    int qry(int low, int high) {
        int res = 0;
        for (low += ms, high += ms; low < high; low >>= 1, high >>= 1) {
            if (low&1) cmax(res, md[low++]);
            if (high&1) cmax(res, md[--high]);
        }
        return res;
    }
};
bool nes[1<<19];
int n, q, a[1<<19], lsh[1<<20], m, dp_pre[1<<19], dp_suf[1<<19];
int ans[1<<19], rec[1<<19], lis, cnt[1<<19];
vi<pii> req[1<<19];
signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    int x, y;
    cin >> n >> q;
    rep(i,n) cin >> a[i], lsh[m++] = a[i];
    rep(i,q) cin >> x >> y, req[--x].eb(lsh[m++] = y, i); 
    sort(lsh, lsh+m);
    m = unique(lsh, lsh+m)-lsh;
    rep(i,n) a[i] = lower_bound(lsh, lsh+m, a[i])-lsh;
    seg_tree pre(m), suf(m);
    rep(i,n) pre.mdf(a[i], dp_pre[i] = pre.qry(0, a[i])+1);
    drep(i,n) {
        rec[i] = suf.qry(a[i]);
        suf.mdf(a[i], dp_suf[i] = suf.qry(a[i]+1, m)+1);
    }
    rep(i,n) cmax(lis, dp_pre[i]+dp_suf[i]-1);
    rep(i,n) cnt[dp_pre[i]] += (dp_pre[i]+dp_suf[i]-1 == lis);
    rep(i,n) nes[i] = (dp_pre[i]+dp_suf[i]-1 == lis && cnt[dp_pre[i]] == 1);
    pre = seg_tree(m);
    rep(i,n) {
        suf.mdf(a[i], rec[i]);
        for (auto const& h : req[i]) {
            int to = lower_bound(lsh, lsh+m, h.first)-lsh;
            ans[h.second] = max(pre.qry(0, to)+suf.qry(to+1, m)+1, lis-nes[i]);
        }
        pre.mdf(a[i], dp_pre[i]);
    }
    copy(ans, ans+q, ostream_iterator<int>(cout, "\n"));
    cout << flush;
}
```
    