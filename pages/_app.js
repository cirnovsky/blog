import React from "react";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Prism from "../lib/prism.js";

function MyApp({ Component, pageProps }) {
  return (
    <main>
      <Prism />
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}

export default MyApp;
