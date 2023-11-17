### Oct 12, 2023 commit caaa3453d079f2e0ca5fdfa9eeaf80551ec84932

- Issue: \<blockquote\> with multiline content is not indented correctly.
- Solution: Manually binary searching the neat distance.  Special check single-line and `@first-child`.  😅

### commit 2d6863b86e8d738c23c10d8a4ef1ebfb4bdaaed1

- Issue: Inline-image and centered-image styles are not distinguished.
- Solution: Use `html-to-ast` to reparse the stringified HTML back to HAST, by traversing which to modified the node specifically.

### Nov 16, 2023 commit c91bddd361f84f86cc51a721cee93def043a636b

- Issue: Statically generated Prism.js rendering taking too much time (up to 7mins for a single udpate)
- Solution: Fuck that shit.  Let us render server-side, but...  there is still some problem.

## Nov 17, 2023 commit d373b822ab8ce6c9f11ee55c4d795d07462f1a62

- Issue: SSR Prism.js needs a re-refresh to render.
- Solution: I turnt to ChatGPT.  Which gives me shit of no use.  After observing, I found out when open pages new-tabbed, it renders, and otherwise not.  It must be fucking React single-page features, letting the script executed only once for a single visit.  Then use `next/router` to re-render on router change. Perfectly solved.