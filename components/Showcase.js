import React, { ReactNode } from "react";

export default function Showcase({ children }) {
    return (
        <div className="flex flex-col gap-y-5">{children}</div>
    )
}
