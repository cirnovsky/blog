import os
import json

paths = ["notes", "articles"]

for path in paths:
    metapath = os.path.join(path, "meta.json")
    with open(metapath, "r", encoding='utf-8') as f:
        metas = json.loads(f.read())
        for meta in metas:
            filepath = os.path.join(path, meta['slug'] + '.html')
            with open(filepath, "r", encoding='utf-8') as f2:
                content = f2.read()
                content = content.replace('            <link rel="stylesheet" href="/src/styles/fonts.css" >\n            <link rel="stylesheet" href="/src/styles/style.css" >\n            <link rel="stylesheet" href="/src/styles/prism.css" >', '            <link rel="stylesheet" href="/src/styles/prism.css" >\n            <link rel="stylesheet" href="/src/styles/fonts.css" >\n            <link rel="stylesheet" href="/src/styles/style.css" >')
                with open(filepath, "w", encoding='utf-8') as wr:
                    wr.write(content)