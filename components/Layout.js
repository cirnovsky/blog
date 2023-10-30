import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Sections, Categories } from "../lib/enums";

export const name = 'Carnicero Irnobkowski';
export const siteTitle = "𝒸𝒾𝓇𝓃ℴ𝓋𝓈𝓀𝓎's blog";

export default function Layout({ children, section }) {
    const homeButton = (section === Sections.HOME) ?
        <div className="caonima dark:text-gray-300">{"首页"}</div> :
        <Link className="no-underline mt-[0.3rem]" href={"/"}>
            <div className="cursor-pointer flex gap-2 text-black dark:text-gray-300 hover:text-[#996E5C] font-medium">{"首页"}</div>
        </Link>
    
    const aboutButton = (section === Sections.ABOUT) ?
        <div className="caonima dark:text-gray-300">{"关于"}</div> :
        <Link className="no-underline mt-[0.3rem]" href={"/about"}>
            <div className="cursor-pointer flex gap-2 text-black dark:text-gray-300 hover:text-[#996E5C] font-medium">{"关于"}</div>
        </Link>

    const notesButton = (section === Categories.NOTES) ?
        <div className='caonima dark:text-gray-300'>{"笔记"}</div> :
        <Link className="no-underline mt-[0.3rem]" href={"/notes"}>
            <div className="cursor-pointer flex gap-2 text-black dark:text-gray-300 hover:text-[#996E5C] font-medium">{"笔记"}</div>
        </Link>

    const articlesButton = (section === Categories.ARTICLES) ?
        <div className='caonima dark:text-gray-300'>{"文章"}</div> :
        <Link className="no-underline mt-[0.3rem]" href={"/articles"}>
            <div className="cursor-pointer flex gap-2 text-black dark:text-gray-300 hover:text-[#996E5C] font-medium">{"文章"}</div>
        </Link>

    const friendsButton = (section === Sections.FRIENDS) ?
        <div className='caonima dark:text-gray-300'>{"友链"}</div> :
        <Link className="no-underline mt-[0.3rem]" href={"/friends"}>
            <div className="cursor-pointer flex gap-2 text-black dark:text-gray-300 hover:text-[#996E5C] font-medium">{"友链"}</div>
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

            <div className='flex flex-col justify-between mx-auto max-w-[50em]'>
                <div className='mt-20'>
                    <div className="flex mx-auto justify-between h-10">
                        <Link className="no-underline text-black dark:text-gray-300 hover:text-[#996E5C]" href={"/"}>
                                {/* <div className="-mt-11"><Image src={"/avatar.png"} width={"75"} height={"75"} alt={"icon"} /></div> */}
                                <div className="font-extrabold text-2xl">{siteTitle}</div>
                        </Link>
                        <div className="flex gap-x-8 items-center">
                            {homeButton}
                            {aboutButton}
                            {notesButton}
                            {articlesButton}
                            {friendsButton}
                        </div>
                    </div>
                </div>
                <hr className="h-[0.07em] -my-[0.375em] bg-black border-0 dark:bg-white"></hr>
                <main className="my-20">{children}</main>
            </div>
        </div>
    );
}
