import React from "react";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }) {
  return (
    <main>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}

export default MyApp;
