import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import {Sections, SectionFunc} from "../lib/enums";
import Image from 'next/image';

import React from 'react';
import Link from 'next/link';

const section = Sections.FRIENDS;

export default function Friends() {
    return (
        <Layout section={section}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <br />
            <div className='content dark:text-gray-300'>
                <p>This page is under progress.</p>
                <ul>
                    <li>Isaac Jin - <Link href="https://www.whale3ye.com/"><italic>CHAOS</italic></Link></li>
                </ul>
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </Layout>
    )
}