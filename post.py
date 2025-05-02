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
        content.replace("""            <button onclick="window.location.href='/'">Home</button>
            <button onclick="window.location.href='notes.html'">Notes</button>
            <button onclick="window.location.href='articles.html'">Articles</button>
            <button onclick="window.location.href='friends.html'">Friends</button>
            <button onclick="window.location.href='stories.html'">Stories</button>""",)