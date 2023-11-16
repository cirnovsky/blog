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
        <link href="../prism/themes/prism.css" rel="stylesheet" />
      </Head>
      <body>
        <script src="../prism/prism.js" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
