import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import {getLatestPostsData} from '../lib/posts'
import React from "react";
import Showcase from '../components/Showcase'
import SmallCard from "../components/SmallCard";
import {Sections, SectionFunc} from "../lib/enums";

export default function Home({allLatestPostsData}) {
    return (
        <Layout section={Sections.HOME}>
            <Head>
                <title>{siteTitle}</title>
                {/* <link href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" rel="stylesheet"></link> */}
            </Head>
            <div>

                {/* Latest */}
                {allLatestPostsData.map(({posts}) => (
                    <div key={posts.toString()}>
                    <Showcase>
                        {posts.map(({id, date, title}) => (
                            <div key={id}>
                                <SmallCard
                                    title={title}
                                    dateString={date} sectionPath={SectionFunc.getPath(Sections.POSTS)}
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

export const getStaticProps = async () => {
    const allLatestPostsData = getLatestPostsData()
    return {
        props: {
            allLatestPostsData
        }
    }
}


