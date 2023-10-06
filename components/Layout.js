import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from "react";
import { Sections, SectionFunc } from "../lib/enums";
import Script from 'next/script';

export const name = 'Carnicero Irnobkowski';
export const siteTitle = "cirnovsky's blog";

export default function Layout({ children, section }) {

    const profileButton = (section === Sections.PROFILE) ?
        <div>{SectionFunc.getName(Sections.PROFILE)}</div> :
        <Link href={"/profile"}>
            <div>{SectionFunc.getName(Sections.PROFILE)}</div>
        </Link>

    const nightButton =
        <div><Image src={"/icons/night.svg"}
            width={"20"} height={"20"} alt={"night"}></Image></div>

    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.svg" />
                <meta
                    name="description"
                    content="cirnovsky's blog"
                />
                {/* TODO: update og image after the repo is public */}
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle,
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            {/* navigator bar */}
            <div
                style={{ "display": "flex" }}>
                <div style={{ "display": "flex", "justifyContent": "flex-end" }}>
                    <div style={{ "display": "flex", "justifyContent": "flex-end" }}>
                        <Link href={"/"}>
                            <div style={{ "display": "flex", "gap": "0.5rem", "color": "#000000", ":hover": { "color": "#996E5C" } }}>
                                <Image src={"/favicon.svg"} width={"28"} height={"28"} alt={"icon"}></Image>
                                <div style={{ "fontSize": "1.5rem", "lineHeight": "2rem", "fontWeight": 800 }}>{siteTitle}</div>
                            </div>
                        </Link>
                    </div>
                    <div style={{ "display": "flex", "flex": "right", "columnGap": "2rem" }}>
                        {profileButton}
                    </div>

                </div>

            </div>

            <div>
                {/* Brief information on the right */}
                <br />
                <div>
                    <main>{children}</main>
                </div>
            </div>

        </div>
    );
}
