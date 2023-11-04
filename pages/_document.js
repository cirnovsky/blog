import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
// import "../styles/prism/ghcolors.css"

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Script href="https://unpkg.com/prismjs@1.29.0/plugins/toolbar/prism-toolbar.min.js"/>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
