import Head from 'next/head'
import Layout, {siteTitle} from '../components/Layout'
import {Sections, SectionFunc} from "../lib/enums";

import React from 'react';
import Link from 'next/link';

const section = Sections.PROFILE;

export default function Profile() {
    return (
        <Layout section={section}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <br />
            &emsp;&emsp;This website is built on <Link href={"https://react.dev/"}>React</Link> + <Link href={"https://nextjs.org/"}>Next.js</Link> with few CSS, with respect to <Link href={"https://bellard.org/"}>Fabrice Bellard</Link>, whom is my inspiration.<br/>
            &emsp;&emsp;If you have any questions or suggestions, write to <Link href={"mailto:cirnovskyv@gmail.com"}>cirnovskyv@gmail.com</Link>.<br/>
        </Layout>
    )
}


