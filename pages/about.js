import Head from "next/head";
import Layout, { siteTitle } from "../components/Layout";
import { Sections, SectionFunc } from "../lib/enums";
import Image from "next/image";

import React from "react";
import Link from "next/link";

const section = Sections.ABOUT;

export default function About() {
  return (
    <Layout section={section}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <br />
      <div className="content">
        <p>
          This website is built on{" "}
          <Link href={"https://react.dev/"}>React</Link> +{" "}
          <Link href={"https://nextjs.org/"}>Next.js</Link> with few CSS.{" "}
        </p>
	  <p>For users inaccessible to jsDelivr, a proper proxy setup would be highly advisable.</p>
        <p>
          If you have any questions or suggestions, write to{" "}
          <i><Link href={"mailto:cirnovskyv@gmail.com"}>cirnovskyv at gmail dot com</Link></i>
          .
        </p>
        <br />
      </div>
    </Layout>
  );
}
