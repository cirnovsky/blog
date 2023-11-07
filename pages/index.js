import Head from "next/dist/shared/lib/head";
import Layout, { siteTitle } from "../components/Layout";
import { Sections } from "../lib/enums";
import Giscus from "@giscus/react";

export default function Home() {
  return (
    <Layout section={Sections.HOME}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="mx-auto">
        <p>简介还没写，路尚漫漫，还待写就。</p>
      </div>
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
        theme="transparent_dark"
        lang="en"
        loading="lazy"
        crossorigin="anonymous"
        async
      />
    </Layout>
  );
}
