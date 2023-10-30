export const Sections = {
    HOME: 0,
    ABOUT: 1,
    POSTS: 2,
    FRIENDS: 5
};

export const Categories = {
    NOTES: 3,
    ARTICLES: 4,
}

const names = ["Home", "About", "Posts", "Notes", "Articles"];
const paths = ["home", "about", "posts", "notes", "articles"];
export var SectionFunc = {
    getName:function(section) {
        return names[section];
    },
    getPath:function(section) {
        return paths[section];
    }
}