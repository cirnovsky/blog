let
    currentBranch, currentPage = 1, totalPage = 1;

const
    ENTRIES_PER_PAGE = 20;

function parseSearch(s) {
    let params = (s.startsWith('?') ? s.substr(1) : s).split("&")
    let result = new Object()
    for (t of params) {
        let [key, value] = t.split('=')
        result[key] = value
    }
    console.log(result)
    return result
}

(function() {
    console.log(ENTRIES_PER_PAGE)
})