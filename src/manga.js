import axios from 'axios'
import cheerio from 'cheerio'

const MAIN_URL = ' https://manganato.com/'
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
 * 
 * @param {*} list 
 * @returns {{}}
 */

export const scrapeLatestManga = async({ list, s = "all", sts = "", orby = "", pages = 1 }) => {
    try {
        let data = []
        var totalStories = ''
        var totalPages = ''
        let index = 0
        for (let i = 1; i < pages + 1; i++) {
            const latestPage = await axios.get(`${MAIN_URL + manga_search_path}?s=${s}&sts=${sts}&orby=${orby}&page=${i}`)
            const $ = cheerio.load(latestPage.data)

            if (i == 1) {
                totalStories = $('div.panel_page_number > div.group_qty > a').text()
                totalPages = $('div.group_page > a.page_blue.page_last').text().replace('Last', '').replace(/\(|\)/g, '')
            }

            $('div.container.container-main > div.panel-content-genres > div').each((i, el) => {
                data.push({
                    index: index,
                    title: $(el).find('div > h3 > a').text().trim(),
                    chapter: $(el).find('div > a.genres-item-chap.text-nowrap.a-h').text().trim(),
                    img: $(el).find('a > img').attr('src'),
                    src: $(el).find('a').attr('href'),
                    synopsis: $(el).find('div:nth-child(1) > div > div').text().replace('More.', '').replace(/\n/g, '').trim(),
                    views: $(el).find('div > p > span.genres-item-view').text().trim(),
                    uploadedDate: $(el).find(`div > p > span.genres-item-time`).text().trim(),
                    authors: $(el).find(`div > p > span.genres-item-author`).text().trim(),
                    rating: $(el).find('a > em').text().trim(),
                })
                index++
            })
        }
        list.push({
            info: {
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


export const scrapeMangaInfo = async(url, list) => {
    let genresList = []
    let authorsList = []
    let chapterList = []
    try {
        const infoPage = await axios.get(url);
        const $ = cheerio.load(infoPage.data)

        const title = $('div.story-info-right > h1').text()
        const img = $('span.info-image > img').attr('src')
        const alt = $('tbody > tr:nth-child(1) > td.table-value > h2').text()
        const status = $('table > tbody > tr:nth-child(3) > td.table-value').text()
        const updated = $('div.story-info-right > div > p:nth-child(1) > span.stre-value').text()
        const views = $('div.story-info-right > div > p:nth-child(2) > span.stre-value').text()
        const synopsis = $('#panel-story-info-description').text()
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
                chapterViews: $(el).find('span:nth-child(1)').text(),
                uploadedDate: $(el).find('span:nth-child(2)').text(),
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
    }
}

// let list = []
// scrapeMangaInfo('https://readmanganato.com/manga-ax951880', list).then((res) => console.log(res))


export const scrapeSearchQuery = async({ searchInfo, query, s = "all", sts = "&sts=", orby = "&orby=", pages = 1 }) => {
    let list = []
    try {
        const searchPage = await axios.get(`${MAIN_URL + manga_search_path}?s=${s}${sts}${orby}&keyw=${query.replace(/\s/g, '_')}`)
        const $ = cheerio.load(searchPage.data)



        $('div.container.container-main > div.panel-content-genres > div').each((i, el) => {
            list.push({
                title: $(el).find('h3 > a').text(),
                authors: $(el).find('div > span:nth-child(4)').text().trim(),
                lastUpdated: $(el).find('div > span:nth-child(5)').text().trim(),
                views: $(el).find('div > span:nth-child(6)').text().trim(),
                img: $(el).find('a > img').attr('src'),
                src: $(el).find('div > h3 > a').attr('href'),
                rating: $(el).find('a > em.genres-item-rate').text()
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