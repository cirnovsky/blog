---
date: '2023-10-09'
title: 'Solution -「CF 710F」String Set Queries'
---

## Desc.

&emsp;&emsp;[Link.](https://codeforces.com/problemset/problem/710/F)

&emsp;&emsp;维护一个字符串集合，支持三种操作：

1. 加字符串;
2. 删字符串;
3. 查询集合中的所有字符串在给出的模板串中出现的次数.

&emsp;&emsp;强制在线.

## Sol.

&emsp;&emsp;アメリカ民謡研究会非常🐂🍺. 开始理解 AC 自动机了...

&emsp;&emsp;题面容易让人想到根号分治, 然而实际上本题可以进行二进制拆分. 这样我们一共维护了 $\mathcal O(log_2 n)$ 个 AC 自动机, 查询的总复杂均摊应该比较明显是 $\mathcal O(m\log_2n)$, 而修改操作, 每个点只会被合并不超过 $\mathcal O(log_2n)$ 次, 因此也是对的.

```cpp
const int N = 3e5;
int q, tot, totNode = 1, rt[N + 5], nxt[N + 5][26], cntEnd[N + 5], fail[N + 5], cntIns[N + 5], sum[N + 5];
bool isChild[N + 5][26];
int merge(int u, int v) {
    if (!u || !v) return u+v;
    cntEnd[u] += cntEnd[v];
    for (int i=0;i<26;++i) {
        nxt[u][i] = merge(isChild[u][i]*nxt[u][i], isChild[v][i]*nxt[v][i]);
        if (nxt[u][i]) isChild[u][i] = 1;
    }
    return u;
}
void build(int st) {
    queue<int> que;
    fail[st] = st;
    for (int i=0;i<26;++i) if (isChild[st][i]) fail[nxt[st][i]] = st, que.push(nxt[st][i]);
        else nxt[st][i] = st;
    while (!que.empty()) {
        int u = que.front(); que.pop();
        sum[u] = sum[fail[u]]+cntEnd[u];
        for (int i=0;i<26;++i) if (isChild[u][i]) fail[nxt[u][i]] = nxt[fail[u]][i], que.push(nxt[u][i]);
            else nxt[u][i] = nxt[fail[u]][i];
    }
}
void ins(const string& s, int dlt) {
    cntIns[tot] = 1;
    int u = rt[tot] = totNode++;
    for (int i=0,iend=s.length();i<iend;++i) {
        if (!nxt[u][s[i]-'a']) nxt[u][s[i]-'a'] = totNode++;
        isChild[u][s[i]-'a'] = 1;
        u = nxt[u][s[i]-'a'];
    }
    cntEnd[u] += dlt;
    while (tot >= 1 && cntIns[tot] == cntIns[tot-1]) {
        rt[tot-1] = merge(rt[tot], rt[tot-1]);
        cntIns[tot-1] *= 2;
        tot--;
    }
    build(rt[tot++]);
}
int Ask(int st, const string& s) {
    int res = 0, u = st;
    for (int i=0,iend=s.size();i<iend;++i) u = nxt[u][s[i]-'a'], res += sum[u];
    return res;
}
int main()
{
    ios::sync_with_stdio(0);
    cin.tie(nullptr);
    cin >> q;
    while (q--) {
        int opt; string s; cin >> opt >> s;
        if (opt == 1) ins(s, 1);
        else if (opt == 2) ins(s, -1);
        else {
            int ans = 0;
            for (int i=0;i<tot;++i) ans += Ask(rt[i], s);
            cout << ans << "\n";
            cout.flush();
        }
    }
}
```