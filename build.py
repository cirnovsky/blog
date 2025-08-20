#!/usr/bin/env python3
import json
import shutil
from pathlib import Path
import subprocess
import yaml
import re

# Paths
ROOT = Path(__file__).parent.resolve()
POSTS_DIR = ROOT / "posts"
NOTES_DIR = ROOT / "notes"
ARTICLES_DIR = ROOT / "articles"
TEMPLATE_FILE = ROOT / "src" / "html" / "tmpl.html"
META_FILE = ROOT / "meta.json"

# Markdown to HTML conversion with pandoc
def md_to_html(md_path: Path) -> str:
    # Read markdown
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract frontmatter
    fm_match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.S)
    if not fm_match:
        raise ValueError(f"No valid frontmatter in {md_path}")
    fm_raw, md_body = fm_match.groups()
    fm = yaml.safe_load(fm_raw)

    # Slug from filename
    slug = md_path.stem

    # Convert markdown body (without frontmatter) to HTML
    html_body = subprocess.check_output(
        [
            "pandoc",
            "--from", "gfm",
            "--to", "html",
            "--katex",
        ],
        input=md_body.encode("utf-8")
    ).decode("utf-8")

    # Insert into template
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as tf:
        template = tf.read()

    final_html = template.replace("{{{content}}}", html_body)
    return final_html, fm, slug

def build():
    # Ensure output dirs exist
    NOTES_DIR.mkdir(exist_ok=True)
    ARTICLES_DIR.mkdir(exist_ok=True)

    # Load existing meta.json or empty list
    if META_FILE.exists():
        with open(META_FILE, "r", encoding="utf-8") as f:
            metadata = json.load(f)
    else:
        metadata = []

    # Iterate over all markdown files in posts/*/*.md
    for md_file in POSTS_DIR.glob("*.md"):
        final_html, fm, slug = md_to_html(md_file)

        # Determine output dir
        category = fm["category"]
        if category == "notes":
            out_path = NOTES_DIR / f"{slug}.html"
        elif category == "articles":
            out_path = ARTICLES_DIR / f"{slug}.html"
        else:
            raise ValueError(f"Unknown category {category} in {md_file}")

        # Write HTML file
        with open(out_path, "w", encoding="utf-8") as out:
            out.write(final_html)

        # Create meta entry
        meta_entry = {
            "date": fm["date"],
            "title": fm["title"],
            "slug": slug,
            "tags": fm.get("tags", []),
            "category": category
        }

        # Remove existing entry with same slug
        metadata = [m for m in metadata if m["slug"] != slug]

        # Insert new entry at front
        print("fuck")
        print(meta_entry)
        metadata.insert(0, meta_entry)

    # Save updated meta.json
    with open(META_FILE, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    build()
