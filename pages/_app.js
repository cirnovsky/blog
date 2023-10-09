import React from "react";
import localFont from 'next/font/local'
import '../styles/global.css'

const myFont = localFont({
    src: [
        {
            path: './french-script-mt.ttf',
            weight: '400',
            style: 'normal'
        },
        {
            path: 'Inkfree.ttf',
            weight: '400',
            style: 'normal'
        }
    ]
})

function MyApp({Component, pageProps}) {
    return (
        <main>
            <Component {...pageProps}/>
        </main>
    )
}

export default MyApp
