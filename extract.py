# tmp
import re
import os
import html
from datetime import datetime
from collections import defaultdict
import json
import markdown
import gfm

def clean(text):
    text = text.replace("\\r\\n", "\n").replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
    return text

def render(text, debug):
    md = markdown.markdown(text, extensions=['fenced_code'])
    md = gfm.gfm(md)
    if debug:
        print(md)
    return md.replace("<blockquote>", """
<div class="panel panel-success">
    <div class="panel-heading">一言</div>
    <div class="panel-body">
""").replace("</blockquote>", """
    </div>
</div>""")

# Path to your SQL dump file
sql_content = "typecho_contents.sql"
sql_meta = "typecho_metas.sql"
sql_rel = "typecho_relationships.sql"
notes_output = "notes"
arts_output = "articles"

# Create output directory
os.makedirs(notes_output, exist_ok=True)
os.makedirs(arts_output, exist_ok=True)

relations = defaultdict(list)
with open(sql_rel, "r", encoding="utf-8") as f:
    content = f.read()
    pattern = r"\((\d+),\s*(\d+)\)"
    matches = re.finditer(pattern, content, re.DOTALL)
    for match in matches:
        cid, mid = map(int, match.groups())
        relations[cid].append(mid)

tags = defaultdict(dict)
with open(sql_meta, "r", encoding='utf-8') as f:
    content = f.read()
    pattern = r"\((\d+),\s*'([^']*)',\s*'([^']*)'"
    matches = re.finditer(pattern, content, re.DOTALL)
    for match in matches:
        mid, name, slug = match.groups()
        mid = int(mid)
        tags[mid] = {
            "name": name,
            "slug": slug
        }

# Read the entire SQL file
with open(sql_content, "r", encoding="utf-8") as f:
    content = f.read()


# Regex to extract cid, title, slug, created, text
pattern = r"\((\d+),\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*\d+,\s*'(.*?)(?<!\\)'"
matches = re.finditer(pattern, content, re.DOTALL)

meta_notes = []
meta_arts = []

for match in matches:
    cid, title, slug, created, text = match.groups()

    cid = int(cid)

    # Decode HTML entities
    text = clean(text)
    text = f"""<!DOCTYPE html>
    <html lang=en>
        <head>
            <meta charset="UTF-8" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP" crossorigin="anonymous">

            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js" integrity="sha384-cMkvdD8LoxVzGF/RPUKAcvmm49FQ0oxwDF3BGKtDXcEc+T1b2N+teh/OJfpU0jr6" crossorigin="anonymous"></script>

            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js" integrity="sha384-hCXGrW6PitJEwbkoStFjeJxv+fSOOQKOPbJxSfM6G5sWZjAyWhXiTIIAmQqnlLlh" crossorigin="anonymous"
                onload="renderMathInElement(document.body);"></script>
            <script src="/src/js/jquery.min.js"></script>
            <link rel="stylesheet" href="/src/styles/fonts.css" >
            <link rel="stylesheet" href="/src/styles/style.css" >
            <script>
                document.addEventListener("DOMContentLoaded", function() {{
                    $("#giscus").load("/src/html/giscus.html")
                    $("#header").load("/src/html/header.html")
                    renderMathInElement(document.body, {{
                        delimiters: [
                            {{left: "$$", right: "$$", display: true}},
                            {{left: "$", right: "$", display: false}}
                        ],
                        throwOnError: false,
                        errorColor: "#cc0000"
                    }});
                }})
            </script>
        </head>
        <body>
            <div class="content">
                <div id="header"></div>
                {render(text, slug == "sol-joisc2023-two-currencies")}
                <script src="https://giscus.app/client.js" data-repo="cirnovsky/blog-comments" data-repo-id="R_kgDOKmz0Wg" data-category="General" data-category-id="DIC_kwDOKmz0Ws4Caiud" data-mapping="pathname" data-strict="0" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="top" data-theme="gruvbox" data-lang="en" crossorigin="anonymous" async></script>
            </div>
        </body>
    </html>
"""

    # Convert created timestamp
    date = datetime.fromtimestamp(int(created)).strftime('%Y%m%d')

    # Prepare markdown content

    # Write to .md file using slug or cid
    filename = f"{slug}.html"
    if len(relations[cid]) == 0 or slug.startswith('@'):
        print(title)
        continue
    filepath = os.path.join(notes_output if relations[cid][0] == 2 else arts_output, filename)

    with open(filepath, "w", encoding="utf-8") as md_file:
        md_file.write(text)
    
    if not (2 <= relations[cid][0] <= 3):
        print(f"Invalid relation for {title}: {relations[cid]}")
        exit(0)
    (meta_notes if relations[cid][0] == 2 else meta_arts).append({
        "date": date,
        "title": title,
        "slug": slug,
        "tags": [tags[x]['slug'] for x in relations[cid] if x > 3]
    })

meta_notes.sort(key=lambda x: x["date"], reverse=True)
meta_arts.sort(key=lambda x: x["date"], reverse=True)
with open("notes/meta.json", "w", encoding="utf-8") as f, open("articles/meta.json", "w", encoding="utf-8") as f2:
    f.write(json.dumps(meta_notes, ensure_ascii=False))
    f2.write(json.dumps(meta_arts, ensure_ascii=False))

print("✅ All posts exported!")
