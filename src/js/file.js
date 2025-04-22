'use strict'

function pagination(ent) {
    const start = (currentPage - 1) * ENTRIES_PER_PAGE
    const end = currentPage * ENTRIES_PER_PAGE
    $("#entries").html(`<table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Title</th>
                <th>URL</th>
                <th>Word count</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>`)
    for (let i = start; i < Math.min(end, ent.length); ++i)
        $(`tbody`).append(`<tr><td>${ent[i].date}</td><td>${ent[i].title}<td><a href="${currentBranch}/${ent[i].slug}.html">${ent[i].slug}</a></td></td><td>unavailable</td></tr>`)
}

function parseEntries(ent) {
    // Dangerous if linux!!!!
    totalPage = Math.ceil(ent.length / ENTRIES_PER_PAGE)
    pagination(ent)

    let pages = new Array()
    for (let i = Math.max(currentPage - 3, 0); i < Math.min(currentPage + 3, totalPage); ++i)
        pages.push(i + 1)
    console.log(`${pages.length}, ${totalPage}`)
    $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?page=${1}'">&lt;&lt;</button>`)
    for (let i of pages) {
        $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?page=${i}'" class="${i==currentPage?'currentPage':''}">${i}</button>`)
    }
    $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?page=${totalPage}'">&gt;&gt;</button><br>`)
    $("#totpage").text(totalPage)
}

(function () {
    'use strict'
})