import assert from "assert";

export enum Sections {
    HOME = 0,
    PROFILE = 1,
    POSTS = 2,
    __LENGTH,
}

export namespace Sections {

    const names = ["Home", "Profile", "Posts"];
    const paths = ["home", "profile", "posts"];

    export function getName(section: Sections) {
        return names[section];
    }

    export function getPath(section: Sections) {
        return paths[section];
    }
}