#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "pypinyin",
#     "python-dotenv",
# ]
# ///

import json
import os
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from pypinyin import lazy_pinyin, Style

ROOT = Path(__file__).parent.resolve()
POSTS_DIR = ROOT / "posts"
LAST_SYNC_FILE = ROOT / ".last_sync"
ENV_FILE = ROOT / ".env"

REPO = "cirnovsky/blog"
API_BASE = f"https://api.github.com/repos/{REPO}"

CAT_PREFIX = "cat:"
DEFAULT_CATEGORY = "articles"


def load_token():
    load_dotenv(ENV_FILE)
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise SystemExit("GITHUB_TOKEN not set in .env")
    return token


def read_last_sync():
    if LAST_SYNC_FILE.exists():
        return LAST_SYNC_FILE.read_text().strip()
    return "1970-01-01T00:00:00Z"


def write_last_sync():
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    LAST_SYNC_FILE.write_text(ts)


def gh_api_get(path, token, params=None):
    url = f"{API_BASE}{path}"
    if params:
        qs = "&".join(f"{k}={v}" for k, v in params.items())
        url = f"{url}?{qs}"

    results = []
    while url:
        req = urllib.request.Request(url, headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        })
        with urllib.request.urlopen(req) as resp:
            results.extend(json.loads(resp.read()))
            url = parse_next_link(resp.headers.get("Link", ""))
    return results


def parse_next_link(link_header):
    if not link_header:
        return None
    for part in link_header.split(","):
        if 'rel="next"' in part:
            match = re.search(r"<(.+?)>", part)
            if match:
                return match.group(1)
    return None


def title_to_slug(title):
    parts = []
    for ch in title:
        if "一" <= ch <= "鿿":
            parts.extend(lazy_pinyin(ch, style=Style.NORMAL))
        elif ch.isascii() and (ch.isalnum() or ch == "-"):
            parts.append(ch.lower())
        else:
            parts.append("-")
    raw = "".join(parts)
    slug = re.sub(r"-+", "-", raw).strip("-")
    return slug or "untitled"


def parse_directives(body):
    """Extract optional slug:/date: directives from the top of the issue body."""
    directives = {}
    lines = (body or "").split("\n")
    consumed = 0
    for line in lines:
        stripped = line.strip()
        m = re.match(r"^(slug|date):\s*(.+)$", stripped)
        if m:
            directives[m.group(1)] = m.group(2).strip()
            consumed += 1
        elif stripped == "":
            consumed += 1
        else:
            break
    remaining = "\n".join(lines[consumed:]).strip()
    return directives, remaining


def issue_to_post(issue):
    title = issue["title"]
    labels = [l["name"] for l in issue["labels"]]

    category = DEFAULT_CATEGORY
    tags = []
    for label in labels:
        if label.startswith(CAT_PREFIX):
            category = label[len(CAT_PREFIX):]
        else:
            tags.append(label)

    directives, body = parse_directives(issue.get("body") or "")

    slug = directives.get("slug") or title_to_slug(title)
    date = directives.get("date") or issue["created_at"][:10]

    tags_yaml = "[" + ", ".join(tags) + "]" if tags else "[]"
    frontmatter = f"---\ndate: {date}\ntitle: \"{title}\"\ncategory: {category}\ntags: {tags_yaml}\n---\n"

    return slug, frontmatter + "\n" + body + "\n"


def sync():
    token = load_token()
    since = read_last_sync()
    print(f"Fetching issues updated since {since} ...")

    issues = gh_api_get("/issues", token, {
        "state": "open",
        "since": since,
        "sort": "updated",
        "direction": "asc",
        "per_page": "100",
    })

    # Filter out pull requests (GitHub REST API returns PRs in /issues too)
    issues = [i for i in issues if "pull_request" not in i]

    if not issues:
        print("No new or updated issues.")
        write_last_sync()
        return

    written = 0
    for issue in issues:
        slug, content = issue_to_post(issue)
        path = POSTS_DIR / f"{slug}.md"
        path.write_text(content, encoding="utf-8")
        print(f"  #{issue['number']} → posts/{slug}.md")
        written += 1

    write_last_sync()
    print(f"Synced {written} issue(s).")


if __name__ == "__main__":
    sync()
