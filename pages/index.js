import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import {getLatestPostsData} from '../lib/posts'
import React from "react";
import Showcase from '../components/Showcase'
import SmallCard from "../components/SmallCard";
import {Sections, SectionFunc} from "../lib/enums";
import splitByYear from '../lib/split-by-year';

export default function Home({latestPostsData}) {
    // console.log(splitByYear(latestPostsData));
    const fuck = latestPostsData;
    return (
        <Layout section={Sections.HOME}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <div className="mx-auto dark:text-gray-300">
                简介还没写，毕竟路尚漫漫，还待写就。
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
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