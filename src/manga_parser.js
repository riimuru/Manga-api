import axios from 'axios'
import cheerio from 'cheerio'

const MAIN_URL = 'https://manganato.com/'
const BASE_URL = 'https://readmanganato.com/'
const manga_search_path = 'advanced_search'


function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}
/**
 * @returns {Promise}
 */

export const scrapeManga = async({ list = [], sts = "", orby = "", inGenre = "", exGenre = "", keyw = "", page = 1 }) => {
    try {
        let data = []
        var totalStories = ''
        var totalPages = ''

        const latestPage = await axios.get(`${MAIN_URL + manga_search_path}?s=all&sts=${sts}&g_i${inGenre}&g_e${exGenre}&keyw=${keyw.replace(/\s/g, '_')}&orby=${orby}&page=${page}`)
        const $ = cheerio.load(latestPage.data)


        totalStories = $('div.panel-page-number > div.group-qty > a').text().split(" : ")[1]
        totalPages = $('div.panel-page-number > div.group-page').children('a').last().text().replace('LAST', '').replace(/\(|\)/g, '')


        $('div.container.container-main > div.panel-content-genres > div').each((i, el) => {
            data.push({
                index: i,
                id: $(el).find('a').attr('href').split('/')[3],
                title: $(el).find('div > h3 > a').text().trim(),
                chapter: $(el).find('div > a.genres-item-chap.text-nowrap.a-h').text().trim(),
                img: $(el).find('a > img').attr('src'),
                host_name: extractHostname($(el).find('a').attr('href')),
                src: $(el).find('a').attr('href'),
                synopsis: $(el).find('div > div.genres-item-description').text().replace('More.', '').replace(/\n/g, '').trim(),
                views: $(el).find('div > p > span.genres-item-view').text().trim(),
                uploadedDate: $(el).find(`div > p > span.genres-item-time`).text().trim(),
                authors: $(el).find(`div > p > span.genres-item-author`).text().trim(),
                rating: $(el).find('a > em').text().trim(),
            })
        })

        list.push({
            info: {
                keyword: keyw,
                filter_status: sts,
                included_genres: inGenre,
                excluded_genres: exGenre,
                order_by: orby,
                current_page: parseInt(page),
                totalStories: totalStories,
                totalPages: totalPages
            },
            data: data
        })
        return data
    } catch (err) {
        console.log(err)
    }
}

// scrapeLatestManga({
//     list: [],
//     pages: 1,
// }).then((res) => console.log(res))


export const scrapeMangaInfo = async({ list = [], src, id, hostName }) => {
    let genresList = []
    let authorsList = []
    let chapterList = []
    try {
        let url = ''

        if (typeof src !== 'undefined' || typeof id !== 'undefined') {
            if (typeof src !== 'undefined') {
                url = src
            } else {
                url = "https://" + hostName + "/" + id
            }
        }

        const infoPage = await axios.get(url);
        const $ = cheerio.load(infoPage.data)

        const title = $('div.story-info-right > h1').text()
        const img = $('span.info-image > img').attr('src')
        const alt = $('tbody > tr:nth-child(1) > td.table-value > h2').text()
        const status = $('table > tbody > tr:nth-child(3) > td.table-value').text()
        const updated = $('div.story-info-right > div > p:nth-child(1) > span.stre-value').text()
        const views = $('div.story-info-right > div > p:nth-child(2) > span.stre-value').text()
        const synopsis = $('#panel-story-info-description').text().replace("Description :", "").replace(/\n/g, '').trim()
        const rating = $('#rate_row_cmd > em > em:nth-child(2) > em > em:nth-child(1)').text()
        const totalVotes = $('#rate_row_cmd > em > em:nth-child(3)').text()

        // authors
        $('table > tbody > tr:nth-child(2) > td.table-value > a').each((i, el) => {
            authorsList.push({
                authorName: $(el).text(),
                authorLink: $(el).attr('href')
            })
        })

        // genres
        $('table > tbody > tr:nth-child(4) > td.table-value > a').each((i, el) => {
            genresList.push({
                genre: $(el).text(),
                genreLink: $(el).attr('href')
            })
        })

        // chapters
        $('div.panel-story-chapter-list > ul > li').each((i, el) => {
            chapterList.push({
                chapterTitle: $(el).find('a').text(),
                chapterViews: $(el).find('span.chapter-view.text-nowrap').text(),
                uploadedDate: $(el).find('span.chapter-time.text-nowrap').text(),
                chapterLink: $(el).find('a').attr('href')
            })
        })

        list.push({
            title: title,
            img: img,
            alt: alt,
            authors: authorsList,
            status: status,
            lastUpdated: updated,
            views: views,
            synopsis: synopsis,
            rating: rating,
            totalVotes: totalVotes,
            genres: genresList,
            chapters: chapterList
        })

        return list


    } catch (err) {
        console.log(err)
        return 'Invalid src or id.'
    }
}

// let list = []
// scrapeMangaInfo('https://readmanganato.com/manga-ax951880', list).then((res) => console.log(res))

// TODO: delete this function
export const scrapeSearchQuery = async({ searchInfo, query, s = "all", sts = "", orby = "", pages = 1 }) => {
    let list = []
    try {
        const searchPage = await axios.get(`${MAIN_URL + manga_search_path}?s=${s}&sts=${sts}&orby=${orby}&keyw=${query.replace(/\s/g, '_')}`)
        const $ = cheerio.load(searchPage.data)



        $('div.container.container-main > div.panel-content-genres > div').each((i, el) => {
            list.push({
                title: $(el).find('div > h3 > a').text().trim(),
                chapter: $(el).find('div > a.genres-item-chap.text-nowrap.a-h').text().trim(),
                img: $(el).find('a > img').attr('src'),
                src: $(el).find('a').attr('href'),
                synopsis: $(el).find('div > div.genres-item-description').text().replace('More.', '').replace(/\n/g, '').trim(),
                views: $(el).find('div > p > span.genres-item-view').text().trim(),
                uploadedDate: $(el).find(`div > p > span.genres-item-time`).text().trim(),
                authors: $(el).find(`div > p > span.genres-item-author`).text().trim(),
                rating: $(el).find('a > em').text().trim(),
            })
        })
        searchInfo.push({
            query: query,
            data: list
        })

        return searchInfo

    } catch (err) {
        console.log(err)
    }
}

// scrapeSearchQuery({ searchInfo: [], query: "solo leveling", }).then((res) => console.log(res))


export const scrapeChapter = async({ list = [], chapterUrl }) => {
    try {
        const chapterPage = await axios.get(chapterUrl)
        const $ = cheerio.load(chapterPage.data);

        $('body > div.body-site > div.container-chapter-reader > img').each((i, el) => {
            list.push({
                img: $(el).attr('src'),
                pageTitle: $(el).attr('title').replace(' - MangaNato.com', '').trim()
            })
        })

        return list

    } catch (err) {
        console.log(err)
    }
}

// let list = []
// scrapeChapter(list, "https://readmanganato.com/manga-mo989871/chapter-20").then((res) => console.log(res))