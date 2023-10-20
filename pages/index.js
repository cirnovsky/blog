import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import {getLatestPostsData} from '../lib/posts'
import React from "react";
import Showcase from '../components/Showcase'
import SmallCard from "../components/SmallCard";
import {Sections, SectionFunc} from "../lib/enums";

export default function Home({latestPostsData}) {
    return (
        <Layout section={Sections.HOME}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <div>
                <Showcase>
                    {latestPostsData.map(({id, date, title}) => (
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
            {/* <br/> */}
            <div style={{"textAlign": "center"}}>... For more, dive into sections in the navbar.</div>
        </Layout>
    );
}

export const getStaticProps = async () => {
    const latestPostsData = getLatestPostsData()
    return {
        props: {
            latestPostsData
        }
    }
}