export const Sections = {
    HOME: 0,
    ABOUT: 1,
    NOTES: 2,
    ARTICLES: 3,
    FRIENDS: 4,
    STORIES: 5,
};

const names = ["首页", "关于", "笔记", "文章", "友链", "动态"];
const paths = ["", "about", "notes", "articles", "friends", "stories"];
export var SectionFunc = {
    getName:function(section) {
        return names[section];
    },
    getPath:function(section) {
        return paths[section];
    }
}