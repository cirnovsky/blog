import React, {ReactNode} from "react";

export default function Showcase({children}: {
    children: ReactNode
}) {
    return (
        <div className={"grid gap-y-3"}>
            <div className={"grid gap-y-2"}>{children}</div>
        </div>
    )
}
