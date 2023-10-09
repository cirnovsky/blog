import React from "react";
import localFont from 'next/font/local'
import '../styles/global.css'

const myFont = localFont({
    src: './french-script-mt.ttf'
})

function MyApp({Component, pageProps}) {
    return (
        <main className={myFont.className}>
            <Component {...pageProps}/>
        </main>
    )
}

export default MyApp
