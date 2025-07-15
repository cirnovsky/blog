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

    const tagsToLinks = (tags) => tags.map(tag => `<a href="/tags/?tag=${tag}">${tag}</a>`)

    for (let i = start; i < end; ++i)
        $(`#${year}`).append(`<tr><td>${formatDate(ent[i].date)}</td><td>${ent[i].title}<td><a href="${ent[i].category}/${ent[i].slug}.html">${ent[i].slug}</a></td></td><td class="no-wrap">${tagsToLinks(ent[i].tags)}</td></tr>`)
}

function parseEntries(ent) {
    let pos = 0
    for (let i = 1; i <= ent.length; ++i) {
        if (i == ent.length || ent[i].date.slice(0, 4) != ent[pos].date.slice(0, 4)) {
            console.log(pos, i, ent[pos].date.slice(0, 4))
            pagination(ent, ent[pos].date.slice(0, 4), pos, i)
            pos = i
        }
    }
}

function renderbycategories(metas)
{
    let count = new Map();
    for (let meta of metas)
    {
        const category = meta.category
        if (!count.has(category))
            count.set(category, 0)
        count.set(category, count.get(category) + 1)
    }
    let all = 0
    for (let [x, y] of count)
        all += y
    let shelf = []
    for (let [category, cnt] of count)
    {
        console.log(category, cnt)
        const fs = Math.min(Math.floor(1.0 * cnt / all * 80), 40) + 15;
        const html = `<span style="font-size: ${fs}px"><a href="/${category}">${category}</a> (${cnt})</span>`
        shelf.push(html)
    }
    $("#categories").append(shelf.join(', '))
}

function renderbytags(metas)
{
    let count = new Map();
    for (let meta of metas)
        for (let tag of meta.tags)
        {
            if (!count.has(tag))
                count.set(tag, 0)
            count.set(tag, count.get(tag) + 1)
        }
    let all = 0;
    for (let [x, y] of count)
        all += y;
    let shelf = []
    for (let [tag, cnt] of count)
    {
        const fs = Math.floor(1.0 * cnt / all * 80) + 15;
        const html = `<span style="font-size: ${fs}px"><a href="/tags/?tag=${tag}">${tag}</a> (${cnt})</span>`
        shelf.push(html)
    }
    $("#tags").append(shelf.join(', '))
}

(function () {
    'use strict'
})
