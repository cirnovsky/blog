import Head from 'next/head'
import Layout, { siteTitle } from '../../components/Layout'
import Giscus from '@giscus/react';
import { Sections, SectionFunc } from "../../lib/enums";

const section = Sections.STORIES;

export default function Home() {
    return (
        <Layout section={section}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <Giscus
                src="https://giscus.app/client.js"
                repo="cirnovsky/blog-comments"
                repoId="R_kgDOKmz0Wg"
                category="General"
                categoryId="DIC_kwDOKmz0Ws4Caiud"
                mapping="pathname"
                strict="0"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="gruvbox"
                lang="en"
                crossorigin="anonymous"
                async
            />
        </Layout>
    );
}