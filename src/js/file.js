'use strict'

function formatDate(s) {
    'use strict'

    const YY = s.slice(0, 4)
    const mm = s.slice(4, 6)
    const dd = s.slice(6, 8)

    const date = new Date(YY, parseInt(mm) - 1, dd)

    console.log(YY, mm, dd, date)
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    return date.toLocaleDateString('en-GB', options)
}

function pagination(ent, year, start, end) {
    $("#entries").append(`<h1>${year}</h1><table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Title</th>
                <th>URL</th>
                <th>Tags</th>
            </tr>
        </thead>
        <tbody id="${year}"></tbody>
    </table>`)

    const tagsToLinks = (tags) => tags.map(tag => `<a href="/tags.html?tag=${tag}">${tag}</a>`)

    for (let i = start; i < end; ++i)
        $(`#${year}`).append(`<tr><td>${formatDate(ent[i].date)}</td><td>${ent[i].title}<td><a href="${ent[i].category}/${ent[i].slug}.html">${ent[i].slug}</a></td></td><td class="no-wrap">${tagsToLinks(ent[i].tags)}</td></tr>`)
}

function parseEntries(ent, params="") {
    // Dangerous if linux!!!!
    // ent = ent.filter(x => ((x.category == currentBranch) || (currentBranch != "notes" && currentBranch != "articles")));
    // totalPage = Math.ceil(ent.length / ENTRIES_PER_PAGE)
    // pagination(ent)

    // let pages = new Array()
    // for (let i = Math.max(currentPage - 3, 0); i < Math.min(currentPage + 3, totalPage); ++i)
    //     pages.push(i + 1)
    // console.log(`${pages.length}, ${totalPage}`)
    // $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?${params}&page=${1}'">&lt;&lt;</button>`)
    // for (let i of pages) {
    //     $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?${params}&page=${i}'" class="${i==currentPage?'currentPage':''}">${i}</button>`)
    // }
    // $("#pageid").append(`<button onclick="location.href='${currentBranch}.html?${params}&page=${totalPage}'">&gt;&gt;</button><br>`)
    // $("#totpage").text(totalPage)
    let pos = 0
    for (let i = 1; i <= ent.length; ++i) {
        if (i == ent.length || ent[i].date.slice(0, 4) != ent[pos].date.slice(0, 4)) {
            console.log(pos, i, ent[pos].date.slice(0, 4))
            pagination(ent, ent[pos].date.slice(0, 4), pos, i)
            pos = i
        }
    }
}

(function () {
    'use strict'
})
