import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import {getLatestPostsData} from '../lib/posts'
import {GetStaticProps} from 'next'
import React from "react";
import Showcase from '../components/Showcase'
import SmallCard from "../components/SmallCard";
import {Sections} from "../lib/enums";

export default function Home({allLatestPostsData}: {
    allLatestPostsData: {
        posts: {
            id: string,
            date: string,
            title: string,
        }[]
    }[]
}) {
    return (
        <Layout section={Sections.HOME}>
            <Head>
                <title>{siteTitle}</title>
                <link href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" rel="stylesheet"></link>
            </Head>
            <div className={"grid gap-y-8"}>

                {/* Latest */}
                {allLatestPostsData.map(({posts}) => (
                    <div key={posts.toString()}>
                    <Showcase>
                        {posts.map(({id, date, title}) => (
                            <div key={id}>
                                <SmallCard
                                    title={title}
                                    dateString={date} sectionPath={Sections.getPath(Sections.POSTS)}
                                    id={id}/>
                            </div>
                        ))}
                    </Showcase>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const allLatestPostsData = getLatestPostsData()
    return {
        props: {
            allLatestPostsData
        }
    }
}


