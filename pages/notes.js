import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import {getCertainPostsData} from '../lib/posts'
import React from "react";
import Showcase from '../components/Showcase'
import SmallCard from "../components/SmallCard";
import {Sections, SectionFunc, Categories} from "../lib/enums";

export default function Home({certainPostsData}) {
    return (
        <Layout section={Categories.NOTES}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <div>
                <Showcase>
                    {certainPostsData.map(({id, date, title}) => (
                        <div key={id}>
                            <SmallCard
                                title={title}
                                dateString={date}
                                sectionPath={SectionFunc.getPath(Sections.POSTS)}
                                id={id}/>
                        </div>
                    ))}
                </Showcase>
            </div>
        </Layout>
    );
}

export const getStaticProps = async () => {
    const certainPostsData = getCertainPostsData(Categories.NOTES)
    return {
        props: {
            certainPostsData
        }
    }
}