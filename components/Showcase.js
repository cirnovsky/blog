import React, { ReactNode } from "react";

export default function Showcase({ children }) {
    return (
        <div className="flex flex-col gap-y-2">{children}</div>
    )
}
