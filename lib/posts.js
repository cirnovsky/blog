import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SectionFunc } from "./enums";

import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkPrism from "remark-prism";
import { unified } from "unified";
import fuckUnified from "./hast2html";
import { parse } from "./html-to-ast";

const postsDirectory = path.join(process.cwd(), "posts");

const FuckYou = unified()
  .use(remarkGfm)
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkPrism, {
    plugins: ["autolinker", "line-numbers", "treeview"],
  })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex)
  .use(rehypeRaw)
  .use(rehypeStringify);

export function getAllPostsData(section) {
  // Get file names under /posts/section
  const fileDir = path.join(
    postsDirectory,
    SectionFunc.getPath(section) || "caonimabi"
  );
  const fileNames = fs.readdirSync(fileDir);
  const allPostsData = [];
  for (const fileName of fileNames) {
    if (!fileName.endsWith(".md")) {
      continue;
    }
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(fileDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const totalMatterResult = matter(fileContents);

    // Combine the data with the id
    allPostsData.push({
      id,
      ...totalMatterResult.data,
    });
  }

  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) return 1;
    else if (a > b) return -1;
    else return 0;
  });
}

export function getAllPostIds(section) {
  const fileDir = path.join(postsDirectory, SectionFunc.getPath(section));
  const fileNames = fs.readdirSync(fileDir);
  const ids = [];
  for (const fileName of fileNames) {
    if (fileName.endsWith(".md")) {
      ids.push({ params: { id: fileName.replace(/\.md$/, "") } });
    }
  }
  return ids;
}

export async function getPostData(section, id) {
  const fullPath = path.join(
    postsDirectory,
    SectionFunc.getPath(section),
    `${id}.md`
  );
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContents);
  const processedContent = FuckYou.processSync(matterResult.content);
  let rinima = processedContent.toString();
  const xCode = /<div class="remark-highlight">(.*?)<\/code><\/pre><\/div>/s;
  const placeholder = "{code area, there's tons of bugs in html-hast, fuck this goddamn shit.}";
  let fuck = [];
  for (let codeBlock = rinima.match(xCode); codeBlock != null; codeBlock = rinima.match(xCode)) {
    fuck.push(codeBlock);
    rinima = rinima.replace(xCode, placeholder);
  }
  let hast = parse(rinima);

  const processedTitle = FuckYou.processSync(matterResult.data.title);
  let contentHtml = hast.map(fuckUnified).join("\n");
  for (var i = 0; i < fuck.length; ++i) {
    contentHtml = contentHtml.replace(placeholder, fuck[i][0]);
  }
  // const contentHtml = processedContent.toString()
  const titleHtml = processedTitle.toString();
  const rawTitle = matterResult.data.title;
  let content = { title: titleHtml, contentHtml, rawTitle };

  return {
    id,
    ...matterResult.data,
    content,
  };
}
