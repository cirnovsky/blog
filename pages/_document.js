import { Html, Head, Main, NextScript } from "next/document";
// import "../styles/prism/ghcolors.css"

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          rel="stylesheet"
        />
        <link
          href="https://unpkg.com/prismjs@1.9.0/plugins/line-numbers/prism-line-numbers.css"
          ref="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
