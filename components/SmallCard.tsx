import React from "react";
import Date from "./Date";
import Image from "next/image";
import Link from "next/link";

export default function SmallCard({ title, dateString, sectionPath, id }: {
    title: string, dateString: string, sectionPath: string, id: string
}) {
    let blogURL = `/${sectionPath}/${id}`
    return (
        <div className="flex gap-x-2">
            <div className={"light-text"}>
                <Date dateString={dateString} />
            </div>
            <Link href={blogURL}>
                <div
                    className={"transition-all hover:duration-250 ease-in-out p-2 grid grid-cols-3 justify-between rounded gap-x-4 hover:text-[#996E5C] hover:cursor-pointer hover:bg-gradient-to-r hover:from-gray-600/5 shadow hover:shadow-lg"}>
                    <div className={"grid col-span-2 content-between"}>
                        <div className={"font-bold text-lg"}>{title}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}