import assert from "assert";

export const Sections = {
    HOME: 0,
    ABOUT: 1,
    POSTS: 2,
    __LENGTH: 3
};

export const Categories = {
    NOTE: 0,
    ARTICLE: 1,
    __LENGTH: 3
}

const names = ["Home", "About", "Posts"];
const paths = ["home", "about", "posts"];
export var SectionFunc = {
    getName:function(section) {
        return names[section];
    },
    getPath:function(section) {
        return paths[section];
    }
}