
#!/usr/bin/env python3
import json
from pathlib import Path
import subprocess
import yaml
import re
from datetime import datetime
import html  # for escaping code content

# Paths
ROOT = Path(__file__).parent.resolve()
POSTS_DIR = ROOT / "posts"
TEMPLATE_FILE = ROOT / "src" / "html" / "tmpl.html"
META_FILE = ROOT / "meta.json"

# Regex for fenced code blocks (GitHub style: ```lang ... ```)
CODE_BLOCK_RE = re.compile(r"```([^\s`]+)?\n(.*?)```", re.S)

def md_to_html(md_path: Path):
    # Read markdown
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract frontmatter
    fm_match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.S)
    if not fm_match:
        raise ValueError(f"No valid frontmatter in {md_path}")
    fm_raw, md_body = fm_match.groups()
    fm = yaml.safe_load(fm_raw)

    # Normalize date
    if "date" in fm:
        if isinstance(fm["date"], datetime):
            fm["date"] = fm["date"].strftime("%Y-%m-%d")
        else:
            try:
                fm["date"] = datetime.fromisoformat(str(fm["date"])).strftime("%Y-%m-%d")
            except Exception:
                fm["date"] = str(fm["date"])

    # Slug from filename
    slug = md_path.stem

    # Extract code blocks and replace with placeholders
    code_blocks = []
    def repl(m):
        lang = m.group(1) or ""
        code = m.group(2)
        placeholder = f"[[[CODEBLOCK{len(code_blocks)}]]]"
        # Escape special chars in code
        code_escaped = html.escape(code)
        wrapped = f'<pre><code class="language-{lang} toolbar">{code_escaped}</code></pre>'
        code_blocks.append((placeholder, wrapped))
        return placeholder

    md_body_safe = CODE_BLOCK_RE.sub(repl, md_body)

    # Convert rest of markdown body with pandoc
    html_body = subprocess.check_output(
        [
            "pandoc",
            "--from", "gfm-tex_math_dollars",
            "--to", "html",
        ],
        input=md_body_safe.encode("utf-8")
    ).decode("utf-8")

    # Restore code blocks
    for placeholder, wrapped in code_blocks:
        html_body = html_body.replace(placeholder, wrapped)

    # Insert into template
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as tf:
        template = tf.read()

    final_html = template.replace("{{{content}}}", html_body)
    return final_html, fm, slug


def build():
    # Load existing meta.json or empty list
    if META_FILE.exists():
        with open(META_FILE, "r", encoding="utf-8") as f:
            metadata = json.load(f)
    else:
        metadata = []

    # Iterate over all markdown files in posts/*.md
    for md_file in POSTS_DIR.glob("*.md"):
        final_html, fm, slug = md_to_html(md_file)

        # Determine category
        category = fm["category"]
        category_dir = ROOT / category
        category_dir.mkdir(exist_ok=True)  # dynamically create if new

        out_path = category_dir / f"{slug}.html"

        # Write HTML file
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(final_html)

        # Create meta entry
        meta_entry = {
            "date": fm.get("date", ""),
            "title": fm.get("title", slug),
            "slug": slug,
            "tags": fm.get("tags", []),
            "category": category
        }

        # Remove existing entry with same slug
        metadata = [m for m in metadata if m["slug"] != slug]

        # Insert new entry at front
        #print(meta_entry)
        assert type(meta_entry["date"]) == "str"
        metadata.insert(0, meta_entry)

    metadata.sort(key=lambda m: m.get("date", ""), reverse=True)
    # Save updated meta.json
    with open(META_FILE, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    build()
