import assert from "assert";

export const Sections = {
    HOME: 0,
    PROFILE: 1,
    POSTS: 2,
    __LENGTH: 3
};

const names = ["Home", "Profile", "Posts"];
const paths = ["home", "profile", "posts"];
export var SectionFunc = {
    getName:function(section) {
        return names[section];
    },
    getPath:function(section) {
        return paths[section];
    }
}