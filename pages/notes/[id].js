import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/Date";
import React from "react";
import { Sections } from "../../lib/enums";

const section = Sections.NOTES;

export default function Post({ postData }) {
  let curPostData = postData.content;
  return (
    <Layout section={section}>
      <Head>
        <title className="text-left"> {curPostData.rawTitle}</title>
      </Head>
      <div>
        <div
          className="text-[40px] dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: curPostData.title }}
        />
        <div className="light-text">
          cirnovsky / <Date dateString={postData.date} />
        </div>
        <div
          className="content dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: curPostData.contentHtml }}
        />
      </div>
      <script
        src="https://giscus.app/client.js"
        data-repo="cirnovsky/blog-comments"
        data-repo-id="R_kgDOKmz0Wg"
        data-category="General"
        data-category-id="DIC_kwDOKmz0Ws4Caiud"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="transparent_dark"
        data-lang="en"
        data-loading="lazy"
        crossorigin="anonymous"
        async
      ></script>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const paths = getAllPostIds(section);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(section, params?.id);
  return {
    props: {
      postData,
    },
  };
};
