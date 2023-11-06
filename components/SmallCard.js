import React from "react";
import Date from "./Date";
import Link from "next/link";

export default function SmallCard({ title, dateString, sectionPath, id }) {
    let blogURL = `/${sectionPath}/${id}`
    return (
        <div className=" w-[40em] flex gap-x-[0.5rem] ml-10">
            <div className="light-text" style={{"width":"118px"}}
            ><Date dateString={dateString} /></div>
            <Link className="no-underline" href={blogURL}>
                <div className={"cursor-pointer flex gap-2 text-iiswis hover:text-[#996E5C]"}>
                    <div dangerouslySetInnerHTML={{__html: title}}/>
                </div>
            </Link>
        </div>
    )
}