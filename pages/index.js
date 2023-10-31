import Head from 'next/dist/shared/lib/head';
import Layout, {siteTitle} from '../components/Layout'
import { Sections } from "../lib/enums";

export default function Home({ latestPostsData }) {
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
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </Layout>
    );
}