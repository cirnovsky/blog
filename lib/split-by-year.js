export default function splitByYear(posts) {
    let result = [], current = [];
    current.push(posts[0]);
    for (var post of posts) {
        if (post.date.slice(0, 4) != current[0].date.slice(0, 4))
            result.push(current), current = []
        current.push(post)
    }
    if (current != []) result += current
    return result;
}