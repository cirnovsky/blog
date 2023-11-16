import Head from "next/dist/shared/lib/head";
import Layout, { siteTitle } from "../components/Layout";
import { Sections } from "../lib/enums";

export default function Home() {
  return (
    <Layout section={Sections.HOME}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="mx-auto">
        <p>简介还没写，路尚漫漫，还待写就。</p>
      </div>
    </Layout>
  );
}
