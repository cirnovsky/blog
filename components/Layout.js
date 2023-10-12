import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Sections, Categories } from "../lib/enums";

export const name = 'Carnicero Irnobkowski';
export const siteTitle = "cirnovsky's blog";

export default function Layout({ children, section }) {

    const aboutButton = (section === Sections.ABOUT) ?
        <div>{"ABOUT"}</div> :
        <Link href={"/about"}>
            <div>{"ABOUT"}</div>
        </Link>

    const notesButton = (section === Categories.NOTES) ?
        <div>{"NOTES"}</div> :
        <Link href={"/notes"}>
            <div>{"NOTES"}</div>
        </Link>

    const articlesButton = (section === Categories.ARTICLES) ?
        <div>{"ARTICLES"}</div> :
        <Link href={"/articles"}>
            <div>{"ARTICLES"}</div>
        </Link>

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
                className={"backdrop-blur-lg border-gray-700/20 fixed h-10 inset-x-0 z-10 flex justify-center bg-gray-300/10"}>
                <div className={"flex justify-end grow max-w-[1200px]"}>
                    <div className={"flex items-center grow"}>
                        <Link href={"/"}>
                            <div className={"cursor-pointer flex gap-2 text-black hover:text-[#996E5C]"}>
                                <div style={{"img": "unset"}}><Image src={"/favicon.svg"} width={"28"} height={"28"} alt={"icon"}></Image></div>
                                <div className={"font-extrabold text-2xl"}>{siteTitle}</div>
                            </div>
                        </Link>
                    </div>
                    <div className={"flex flex-none gap-x-8"} style={{"line-height": "2em"}}>
                        {aboutButton}
                        {notesButton}
                        {articlesButton}
                    </div>

                </div>
            </div>

            <div>
                {/* Brief information on the right */}
                <br />
                <br />
                <br />
                <div className={"col-span-4 ml-20"}>
                    <main>{children}</main>
                </div>
            </div>

        </div>
    );
}
