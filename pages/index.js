import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import {getAllPostsData} from '../lib/posts'
import React from "react";
import Showcase from '../components/Showcase'
import SmallCard from "../components/SmallCard";
import {Sections, SectionFunc} from "../lib/enums";

export default function Home({allPostsData}) {
    return (
        <Layout section={Sections.HOME}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <div>

                {/* All */}
                {allPostsData.map(({posts}) => (
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
    const allPostsData = getAllPostsData()
    return {
        props: {
            allPostsData
        }
    }
}


