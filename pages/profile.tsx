import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import React from "react";
import {Sections} from "../lib/enums";

const section = Sections.PROFILE;

export default function Profile() {
    return (
        <Layout section={section}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
        </Layout>
    )
}


