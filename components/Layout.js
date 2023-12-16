import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { SectionFunc, Sections } from "../lib/enums";

export const name = "Carnicero Irnobkowski";
export const siteTitle = "Wang Site | 汪站";

export default function Layout({ children, section }) {
  const pages = Object.values(Sections);
  const buttons = pages.map((page) => {
    let caonima =
      "cursor-pointer flex gap-2 text-black hover:text-[#996E5C] font-medium";
    if (page == section) caonima = "caonima " + caonima;
    return (
      <Link
        id={Number(page)}
        className="no-underline mt-[0.3rem]"
        href={"/" + SectionFunc.getPath(page)}
      >
        <div className={caonima}>{SectionFunc.getName(page)}</div>
      </Link>
    );
  });

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <meta name="description" content="cirnovsky's blog" />
        {/* TODO: update og image after the repo is public */}
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Image src="/background.svg" width={200} height={200} className={"fixed bottom-0 right-0 select-none drag-none"} />
      <div className="flex flex-col justify-between my-3 mx-auto max-w-[50em] px-[2em] rounded-lg border-solid active:border-dotted border-2 border-gray-200">
        <div className="mt-20">
          <div className="flex mx-auto justify-between h-10">
            <Link
              className="no-underline text-black hover:text-[#996E5C]"
              href={"/"}
            >
            { /* <div className="font-extrabold text-2xl">{siteTitle}</div>*/ }
            <Image src="/avatar.png" width={80} height={80} className="rounded-full shadow-2xl"/>
            </Link>
            <div className="flex gap-x-8 items-center">{buttons}</div>
          </div>
        </div>
        <hr className="ml-24 h-[0.07em] -my-[0.375em] bg-black border-0"></hr>
        <main className="my-20">{children}</main>
      </div>
    </div>
  );
}
