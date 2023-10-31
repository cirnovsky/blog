import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/Date";
import React from "react";
import { Sections } from "../../lib/enums";
import Giscus from "@giscus/react";

const section = Sections.ARTICLES;

export default function Post({ postData }) {
    let curPostData = postData.content;
    return (<Layout section={section}>
        <Head>
            <title className="text-left"> {curPostData.rawTitle}</title>
        </Head>
        <div>
            <div className="text-[40px] dark:text-gray-300" dangerouslySetInnerHTML={{ __html: curPostData.title }} />
            <div className="light-text">
                cirnovsky / <Date dateString={postData.date} />
            </div>
            <div className="post-wrapper content dark:text-gray-300" dangerouslySetInnerHTML={{ __html: curPostData.contentHtml }} />
        </div>
        <Giscus src="https://giscus.app/client.js"
            repo="cirnovsky/blog-comments"
            repo-id="R_kgDOKmz0Wg"
            category="[ENTER CATEGORY NAME HERE]"
            category-id="[ENTER CATEGORY ID HERE]"
            mapping="pathname"
            strict="0"
            reactions-enabled="1"
            emit-metadata="0"
            input-position="top"
            theme="transparent_dark"
            lang="en"
            loading="lazy"
            crossorigin="anonymous"
            async>
        </Giscus>
    </Layout>)
}

export const getStaticPaths = async () => {
    const paths = getAllPostIds(section);
    return {
        paths, fallback: false,
    };
}


export const getStaticProps = async ({ params }) => {
    const postData = await getPostData(section, params?.id)
    return {
        props: {
            postData,
        }
    };
}