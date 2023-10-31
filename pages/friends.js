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
                    <li>cqbzly - <Link href="https://duanyu.netlify.app/"><i>duanyu's blog</i></Link> / <Link href="https://blog.csdn.net/cqbzlydd"><i>duanyu's blog (CSDN)</i></Link></li>
                    <li>Raisetsu41 - <Link href="https://iridescent41.cf/"><i>Raisetsu41's blog</i></Link></li>
                    <li>Isaac Jin - <Link href="https://www.whale3ye.com/"><i>CHAOS</i></Link></li>
                </ul>
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </Layout>
    )
}