export const Sections = {
    HOME: 0,
    ABOUT: 1,
    NOTES: 2,
    ARTICLES: 3,
    FRIENDS: 4
};

const names = ["首页", "关于", "笔记", "文章", "友链"];
const paths = ["", "about", "notes", "articles", "friends"];
export var SectionFunc = {
    getName:function(section) {
        return names[section];
    },
    getPath:function(section) {
        return paths[section];
    }
}