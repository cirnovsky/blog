import Layout from "../../components/Layout";
import {getAllPostIds, getPostData} from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/Date";
import React from "react";
import { Categories, Sections } from "../../lib/enums";

export default function Post({postData}) {
    let curPostData = postData.content;
    return (<Layout section={postData.category == 'Notes' ? Categories.NOTES : Categories.ARTICLES}>
        <Head>
            <title className="text-left"> {curPostData.rawTitle}</title>
        </Head>
        <div>
            <div className="content">
                <><div className="text-[40px] dark:text-gray-300" dangerouslySetInnerHTML={{__html: curPostData.title}}/></>
                <div className="light-text">
                cirnovsky / <Date dateString={postData.date}/>
                </div>
            </div>
            <div className="content dark:text-gray-300" dangerouslySetInnerHTML={{__html: curPostData.contentHtml}}/>
        </div>
    </Layout>)
}

export const getStaticPaths = async () => {
    const paths = getAllPostIds();
    return {
        paths, fallback: false,
    };
}


export const getStaticProps = async ({params}) => {
    const postData = await getPostData(params?.id)
    return {
        props: {
            postData,
        }
    };
}