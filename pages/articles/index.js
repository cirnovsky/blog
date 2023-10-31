import Head from 'next/head'
import Layout, {siteTitle} from '../../components/Layout'
import {getAllPostsData} from '../../lib/posts'
import React from "react";
import Showcase from '../../components/Showcase'
import SmallCard from "../../components/SmallCard";
import {Sections, SectionFunc} from "../../lib/enums";

const section = Sections.ARTICLES;

export default function Home({posts}) {
    return (
        <Layout section={section}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <div>
                <Showcase>
                    {posts.map(({id, date, title}) => (
                        <div key={id}>
                            <SmallCard
                                title={title}
                                dateString={date}
                                sectionPath={SectionFunc.getPath(section)}
                                id={id}/>
                        </div>
                    ))}
                </Showcase>
            </div>
        </Layout>
    );
}

export const getStaticProps = async () => {
    const posts = getAllPostsData(section)
    return {
        props: {
            posts
        }
    }
}