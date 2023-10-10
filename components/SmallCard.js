import React from "react";
import Date from "./Date";
import Image from "next/image";
import Link from "next/link";

export default function SmallCard({ title, dateString, sectionPath, id }) {
    let blogURL = `/${sectionPath}/${id}`
    return (
        <div className="entry" style={{"display":"flex","columnGap":"0.5rem"}}>
            <div className="light-text" style={{"width":"118px"}}
            ><Date dateString={dateString} /></div>
            <Link href={blogURL}>
                <div dangerouslySetInnerHTML={{__html: title}}/>
            </Link>
        </div>
    )
}