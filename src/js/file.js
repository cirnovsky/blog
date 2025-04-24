'use strict'

function formatDate(s) {
    'use strict'

    const YY = s.slice(0, 4)
    const mm = s.slice(4, 6)
    const dd = s.slice(6, 8)

    const date = new Date(YY, mm, dd)

    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    return date.toLocaleDateString('en-GB', options)
}

function pagination(ent) {
    const start = (currentPage - 1) * ENTRIES_PER_PAGE
    const end = currentPage * ENTRIES_PER_PAGE
    $("#entries").html(`<table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Title</th>
                <th>URL</th>
                <th>Tags</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>`)

    const tagsToLinks = (tags) => tags.map(tag => `<a href="/tags.html?tag=${tag}">${tag}</a>`)

    for (let i = start; i < Math.min(end, ent.length); ++i)
        $(`tbody`).append(`<tr><td>${formatDate(ent[i].date)}</td><td>${ent[i].title}<td><a href="${currentBranch}/${ent[i].slug}.html">${ent[i].slug}</a></td></td><td class="no-wrap">${tagsToLinks(ent[i].tags)}</td></tr>`)
}

function parseEntries(ent, params="") {
    // Dangerous if linux!!!!
    totalPage = Math.ceil(ent.length / ENTRIES_PER_PAGE)
    pagination(ent)

    let pages = new Array()
    for (let i = Math.max(currentPage - 3, 0); i < Math.min(currentPage + 3, totalPage); ++i)
        pages.push(i + 1)
    console.log(`${pages.length}, ${totalPage}`)
    $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?${params}&page=${1}'">&lt;&lt;</button>`)
    for (let i of pages) {
        $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?${params}&page=${i}'" class="${i==currentPage?'currentPage':''}">${i}</button>`)
    }
    $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?${params}&page=${totalPage}'">&gt;&gt;</button><br>`)
    $("#totpage").text(totalPage)
}

(function () {
    'use strict'
})