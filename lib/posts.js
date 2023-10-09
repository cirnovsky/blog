import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from "remark";
import html from 'remark-html';
import {Sections, SectionFunc} from "./enums";

import rehypeKatex from 'rehype-katex'
import rehypeMathjax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import {unified} from 'unified'

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    // Get file names under /posts/
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = [];
    for (const fileName of fileNames) {
        if (!fileName.endsWith(".md")) {
            continue;
        }
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const totalMatterResult = matter(fileContents);

        // Combine the data with the id
        allPostsData.push({
            id,
            ...totalMatterResult.data,
        });
    }

    // Sort posts by date
    return allPostsData.sort(({date: a}, {date: b}) => {
        if (a < b) return 1;
        else if (a > b) return -1;
        else return 0;
    });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    const ids = [];
    for (const fileName of fileNames) {
        if (fileName.endsWith('.md')) {
            ids.push({params: {id: fileName.replace(/\.md$/, '')}});
        }
    }
    return ids;
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');

    const matterResult = matter(fileContents);
    const processedContent = await unified()
        .use(remarkGfm)
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype, {allowDangerousHtml: true})
        .use(rehypeRaw)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(matterResult.content)
    const processedTitle = await unified()
        .use(remarkGfm)
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype, {allowDangerousHtml: true})
        .use(rehypeRaw)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(matterResult.data.title)
    const contentHtml = processedContent.toString();
    const titleHtml = processedTitle.toString();
    const rawTitle = matterResult.data.title;
    let content = {title: titleHtml, contentHtml, rawTitle};

    return {
        id,
        ...matterResult.data,
        content,
    };
}

export function getLatestPostsData() {
    const sections = [Sections.POSTS];

    const allLatestPostsData = sections.map((section) => {
        const sortedPostData = getSortedPostsData();
        const latestPostsData = sortedPostData;

        return {
            section,
            posts: latestPostsData,
        };
    });

    return allLatestPostsData.sort(({section: a}, {section: b}) => {
        if (a > b) return 1;
        else if (a < b) return -1;
        else return 0;
    });
}