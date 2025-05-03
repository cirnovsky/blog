import os
import json

def traverse(dir):
    result = []
    for dirpath, dirnames, filenames in os.walk(dir):
        for filename in filenames:
            if filename.endswith(".html"):
                result.append(os.path.join(dirpath, filename))
    return result

result = traverse(".")
for now in result:
    with open(now, "r", encoding='utf-8') as f:
        content = f.read()
        content = content.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n        <meta name="viewport" content="width=device-width, initial-scale=1.0" />')
        with open(now, "w", encoding='utf-8') as wr:
            wr.write(content)