import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from "react";
import { Sections } from "../lib/enums";
import Script from 'next/script';

export const name = 'Carnicero Irnobkowski';
export const siteTitle = "cirnovsky's blog";

export default function Layout({ children, section }: {
    children: ReactNode,
    section?: Sections,
}) {

    const profileButton = (section === Sections.PROFILE) ?
        <div className={"navi-selected navibutton-wide"}>{Sections.getName(Sections.PROFILE)}</div> :
        <Link href={"/profile"}>
            <div
                className={"navi-unselected hover:navi-selected navibutton-wide"}>{Sections.getName(Sections.PROFILE)}</div>
        </Link>

    const nightButton =
        <div className={"navibutton hover:navi-selected"}><Image src={"/icons/night.svg"} className={"cursor-pointer"}
            width={"20"} height={"20"} alt={"night"}></Image></div>

    return (
        <div className={"grid gap-10"}>
            <Head>
                <link rel="icon" href="/favicon.svg" />
                <meta
                    name="description"
                    content="Isaac Jin's personal blog"
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
                <link href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" rel="stylesheet"></link>
            </Head>

            {/* navigator bar */}
            <div
                className={"flex"}>
                <div className={"flex justify-end grow"}>
                    <div className={"flex items-center grow"}>
                        <Link href={"/"}>
                            <div className={"cursor-pointer flex gap-2 text-black hover:text-[#996E5C]"}>
                                <Image src={"/favicon.svg"} width={"28"} height={"28"} alt={"icon"}></Image>
                                <div className={"font-extrabold text-2xl"}>{siteTitle}</div>
                            </div>
                        </Link>
                    </div>
                    <div className={"flex flex-none gap-x-8"}>
                        <div className={"flex gap-x-2"}>
                            {nightButton}
                        </div>
                        {profileButton}
                    </div>

                </div>

            </div>

            <div className={"flex"}>
                <div className={"grid-cols-5 grid grow"}>
                    {/* Brief information on the right */}
                    <div className={"col-span-4"}>
                        <main>{children}</main>
                    </div>
                </div>
            </div>

        </div>
    );
}
