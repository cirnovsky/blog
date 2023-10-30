import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/Date";
import React from "react";
import { Categories, Sections } from "../../lib/enums";
import Giscus from "@giscus/react";

export default function Post({ postData }) {
    let curPostData = postData.content;
    return (<Layout section={postData.category == 'Notes' ? Categories.NOTES : Categories.ARTICLES}>
        <Head>
            <title className="text-left"> {curPostData.rawTitle}</title>
        </Head>
        <div>
            <div className="content">
                <><div className="text-[40px] dark:text-gray-300" dangerouslySetInnerHTML={{ __html: curPostData.title }} /></>
                <div className="light-text">
                    cirnovsky / <Date dateString={postData.date} />
                </div>
            </div>
            <div className="content dark:text-gray-300 first-letter:font-extrabold" dangerouslySetInnerHTML={{ __html: curPostData.contentHtml }} />
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
            crossorigin="anonymous"
            async>
        </Giscus>
    </Layout>)
}

export const getStaticPaths = async () => {
    const paths = getAllPostIds();
    return {
        paths, fallback: false,
    };
}


export const getStaticProps = async ({ params }) => {
    const postData = await getPostData(params?.id)
    return {
        props: {
            postData,
        }
    };
}