---
date: '2021-03-16'
title: '龚体诗尝试集'
category: 'Articles'
---

龚体诗记录：）。

>你出卖灵魂有保障

>母亲买保险

>**甩甩脑袋又去上班**

>结局皆大欢喜

---

>脑子上的包 非常地大

---

>那日回头望

>楼上房间看到了

>向前看

>竟是脑子上的包

---

>牛逼一二大于我

>做好翻译为民

>至今未见位于韩国

>谷歌科技有限公司

---

>宗教事务管理附件

>附近医院放假一天

>无脑文件发生的我

>无颜面对眼也笑了

---

>解决方法显而易见

---

>要发生了

>感觉一无是处

>朋友突然飞机化

>解决方法显而易见

https://darkbzoj.tk/problem/4176


```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
#define cmin(x, ...) x = min({x, __VA_ARGS__})
#define cmax(x, ...) x = max({x, __VA_ARGS__})
#define fors(i, l, r, ...) for(int i = (l), i##end = (r), ##__VA_ARGS__; i <= i##end; i++)
#define dfors(i, r, l, ...) for(int i = (r), i##end = (l), ##__VA_ARGS__; i >= i##end; i--)
const int P = 1000000007;
// f = mu, g = 1, f*g = e
// g(1)S(n) = (sum(1~n)f*g[i])-(sum(2~n)g[i]*S(n/i))
struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x^(x>>30))*0xbf58476d1ce4e5b9;
        x = (x^(x>>27))*0x94d049bb133111eb;
        return x^(x>>31);
    }
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x+FIXED_RANDOM);
    }
};
const function<int(const int)> p_mu = [](const int x) {
    static const int THRESHOLD = 1e7;
    static unordered_map<int, int, custom_hash> g_mu;
    static const auto l_mu = [](const int n) {
        vector<int> mu(n+1), prime;
        vector<bool> not_prime(n+1);
        fors(i, (mu[1] = 1)+1, n) {
            if(not_prime[i] == 0) mu[i] = P-1,prime.emplace_back(i);
            for(const int p : prime) {
                if(i > n/p) break;
                not_prime[i*p] = 1;
                if(i%p == 0) break;
                mu[i*p] = P-mu[i];
            }
        }
        fors(i, 1, n) mu[i] += mu[i-1],mu[i] %= P;
        return mu;
    }(THRESHOLD);
    if(x <= THRESHOLD) return l_mu[x];
    if(g_mu.count(x)) return g_mu[x];
    int res = 1; // sum of e(n)
    for(int l = 2, r; l <= x; l = r+1) {
        r = x/(x/l);
        res -= ll(r-l+1)*p_mu(x/l)%P, res %= P;
    }
    return g_mu[x] = (res+P)%P;
};
const auto rg_mu = [](const int l, const int r) { return (p_mu(r)-p_mu(l-1)+P)%P; };
int p_div_sum(const int n) { // return (sum(1~n) n/i)^2
    int res = 0;
    for(int l = 1, r; l <= n; l = r+1) {
        r = n/(n/l);
        res += ll(n/l)*(r-l+1)%P, res %= P;
    }
    return ll(res)*res%P;
}
signed main() {
    ios::sync_with_stdio(0), cin.tie(0);
    int n, ans = 0;
    cin >> n;
    for(int l = 1, r; l <= n; l = r+1) {
        r = n/(n/l);
        ans += (ll)rg_mu(l, r)*p_div_sum(n/l)%P, ans %= P;
    }
    cout << ans << "\n";
    return 0;
}
```

quote lyrics from laur

>This is the story of an ordinary man

>He's a quiet man who seeks no glory,

>but he's not afraid to defend what he loves

>He is a simple man

>who knows only that loyalty, honesty, and truth mean everything

>This is the story of a hero

>She is the last of her kind,

>the descendant of an ancient line of women

>who commanded reverence, obedience, and love

>But only when he faces

>the dark secret within his own heart, can he grow to the man

>who has been chosen?

>I think there's a reason I'm a shadow, but she looks like an angel

>What's your name pretty boy?

>Which way do you think we should go?

>Her shadow, an endless night, falls on the land

>One man must undertake an expedition, an ancient treasure

>But the fire that brings the light can also burn the soul

>The only companion that you can trust is courage