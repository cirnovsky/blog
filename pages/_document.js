import { Html, Head, Main, NextScript } from "next/document";
import PrismSetup from '../lib/prism';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          rel="stylesheet"
        />
        <link href="https://cdn.jsdelivr.net/gh/cirnovsky/cdn/prism/themes/ghcolors.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/gh/cirnovsky/cdn/prism/themes/plugins.css" rel="stylesheet" />
      </Head>
      <body>
        <script src="../prism/prism.js" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
