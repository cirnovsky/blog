import Layout from "../../components/Layout";
import {getAllPostIds, getPostData} from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/Date";
import React from "react";

export default function Post({postData}) {
    let curPostData = postData.content;
    return (<Layout>
        <Head>
            <title>{curPostData.rawTitle}</title>
        </Head>
        <div>
            <div>
                <h1><div dangerouslySetInnerHTML={{__html: curPostData.title}}/></h1>
                <div className="light-text" style={{"width":"118px"}}>
                    <Date dateString={postData.date}/>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{__html: curPostData.contentHtml}}/>
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
