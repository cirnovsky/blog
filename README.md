# blog

Source for [guanyu.me](https://guanyu.me).

## Layout

- `posts/` — Markdown sources with YAML frontmatter (`date`, `title`, `slug`, `tags`, `category`)
- `src/html/tmpl.html` — page template
- `articles/`, `notes/`, `blabbers/`, `toys/` — generated post pages by category
- `tags/`, `archives/` — generated index pages
- `meta.json` — post index consumed by the site
- `index.html`, `toc.html` — landing and table-of-contents pages

## Scripts

- `build.py` — render Markdown in `posts/` to HTML and refresh `meta.json`
- `sync.py` — pull posts from GitHub Issues in `cirnovsky/blog`
- `sync.sh` — wrapper that runs sync then build
- `post.py` — one-off HTML patcher
- `extract.py` — utility script
