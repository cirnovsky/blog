import os
import json
import re

paths = ["notes", "articles"]

for path in paths:
    metapath = os.path.join(path, "meta.json")
    with open(metapath, "r", encoding='utf-8') as f:
        metas = json.loads(f.read())
        for meta in metas:
            filepath = os.path.join(path, meta['slug'] + '.html')
            with open(filepath, "r", encoding='utf-8') as f2:
                content = f2.read()
                if "~~" in content:
                    content = re.sub(r"~~(.*?)~~", r"<del>\1</del>", content)
                    with open(filepath, "w", encoding='utf-8') as wr:
                        wr.write(content)