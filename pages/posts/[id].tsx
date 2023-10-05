import Layout from "../../components/Layout";
import {getAllPostIds, getPostData} from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/Date";
import {GetStaticPaths, GetStaticProps} from "next";
import {Sections} from "../../lib/enums";
import React from "react";
import Link from "next/link";
import Script from "next/script";

export default function Post({postData}: {
    postData: {
        id: string,
        date: string,
        content: { title: string, contentHtml: string }
    },
}) {
    let curPostData = postData.content;
    return (<Layout>
        <Head>
                <link href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" rel="stylesheet"></link>
            <title>{curPostData.title}</title>
        </Head>
        <div className={"blog-content"}>
            <div>
                <h1 className={"mt-0 mb-2"}>{curPostData.title}</h1>
                <div className={"light-text"}>
                    <Date dateString={postData.date}/>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{__html: curPostData.contentHtml}}/>
        </div>
    </Layout>)
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();
    return {
        paths, fallback: false,
    };
}


export const getStaticProps: GetStaticProps = async ({params}) => {
    const postData = await getPostData(params?.id as string)
    return {
        props: {
            postData,
        }
    };
}
