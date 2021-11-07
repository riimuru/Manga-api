import axios from 'axios'
import cheerio from 'cheerio'

const MAIN_URL = 'https://mangakakalot.com/'
const latest_manga_path = 'manga_list'
const search_path = 'search/story/'


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


export const scrapeLatestManga = async({ list, type = "latest", category = "all", state = "all", pages = 1 }) => {
    try {
        let data = []
        var totalStories = ''
        var totalPages = ''
        let index = 0
        for (let i = 1; i < pages + 1; i++) {
            const latestPage = await axios.get(`${MAIN_URL + latest_manga_path}?type=${type}&category=${category}$state=${state}&page=${i}`)
            const $ = cheerio.load(latestPage.data)

            if (i == 1) {
                totalStories = $('div.panel_page_number > div.group_qty > a').text()
                totalPages = $('div.group_page > a.page_blue.page_last').text().replace('Last', '').replace(/\(|\)/g, '')
            }

            $('div.leftCol.listCol > div > div.list-truyen-item-wrap').each((i, el) => {
                data.push({
                    index: index,
                    title: $(el).find('h3 > a').text().trim(),
                    chapter: $(el).find('a.list-story-item-wrap-chapter').text().trim(),
                    img: $(el).find('a:nth-child(1) > img').attr('src'),
                    src: $(el).find('a').attr('href'),
                    synopsis: $(el).find('p').text().replace('More.', '').replace(/\n/g, '').trim(),
                    views: $(el).find('div > span').text().trim()
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
//     pages: 1
// }).then((res) => console.log(res))


export const scrapeMangaInfo = async(url, list) => {
    let genresList = []
    let authorsList = []
    let chapterList = []
    try {
        if (extractHostname(url) == "readmanganato.com") {
            const infoPage = await axios.get(url);
            const $ = cheerio.load(infoPage.data)

            const title = $('div.story-info-right > h1').text()
            const img = $('span.info-image > img').attr('src')
            const alt = $('tbody > tr:nth-child(1) > td.table-value > h2').text()
            const status = $('table > tbody > tr:nth-child(3) > td.table-value').text()
            const updated = $('div.story-info-right > div > p:nth-child(1) > span.stre-value').text()
            const views = $('div.story-info-right > div > p:nth-child(2) > span.stre-value').text()
            const synopsis = $('#panel-story-info-description').text()

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
                genres: genresList,
                chapters: chapterList
            })

            return list

        } else {
            const infoPage = await axios.get(url);
            const $ = cheerio.load(infoPage.data)

            const title = $('div.manga-info-top > ul > li:nth-child(1) > h1').text()
            const img = $('div.manga-info-top > div > img').attr('src')
            const alt = $('div.manga-info-top > ul > li:nth-child(1) > h2').text()
            const status = $('div.manga-info-top > ul > li:nth-child(3)').text()
            const updated = $('div.manga-info-top > ul > li:nth-child(4)').text()
            const views = $('div.manga-info-top > ul > li:nth-child(6)').text()
            const synopsis = $('#noidungm').text()

            // authors
            $('div.manga-info-top > ul > li:nth-child(2) > a').each((i, el) => {
                authorsList.push({
                    authorName: $(el).text(),
                    authorLink: $(el).attr('href')
                })
            })

            // genres
            $('div.manga-info-top > ul > li:nth-child(7) > a').each((i, el) => {
                genresList.push({
                    genre: $(el).text(),
                    genreLink: $(el).attr('href')
                })
            })

            // chapters
            $('#chapter > div > div.chapter-list > div').each((i, el) => {
                chapterList.push({
                    chapterTitle: $(el).find('span:nth-child(1) > a').text(),
                    chapterViews: $(el).find('span:nth-child(2)').text(),
                    uploadedDate: $(el).find('span:nth-child(3)').text().trim(),
                    chapterLink: $(el).find('span:nth-child(1) > a').attr('href')
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
                genres: genresList,
                chapters: chapterList
            })

            return list

        }




    } catch (err) {
        console.log(err)
    }
}

let list = []
scrapeMangaInfo('https://mangakakalot.com/manga/four_daughters_of_armian', list).then((res) => console.log(res))


export const scrapeSearchQuery = async({ searchInfo, query, pages = 1 }) => {
    let latestChapters = []
    let list = []
    try {
        const searchPage = await axios.get(MAIN_URL + search_path + query)
        const $ = cheerio.load(searchPage.data)


        const totalStoriesFound = $("div.panel_page_number > div.group_qty > a").text()
        const totalPages = $("div.group_page > a.page_blue.page_last").text().replace('Last', '').replace(/\(|\)/g, '')

        $('div.leftCol > div.daily-update > div > div').each((i, el) => {
            $(el).find('div > em.story_chapter').each((i, ell) => {
                    latestChapters.push({
                        chapterTitle: $(ell).find('a').text().trim(),
                        chapterLink: $(ell).find('a').attr('href')
                    })
                }),
                list.push({
                    title: $(el).find('h3 > a').text(),
                    authors: $(el).find('div > span:nth-child(4)').text().trim(),
                    lastUpdated: $(el).find('div > span:nth-child(5)').text().trim(),
                    views: $(el).find('div > span:nth-child(6)').text().trim(),
                    img: $(el).find('a > img').attr('src'),
                    src: $(el).find('div > h3 > a').attr('href'),
                    latestChapters: latestChapters
                })
            latestChapters = []
        })
        searchInfo.push({
            query: query,
            totalStoriesFound: totalStoriesFound,
            totalPages: totalPages,
            data: list
        })

        return searchInfo

    } catch (err) {
        console.log(err)
    }
}

// let list = []
// scrapeSearchQuery(list, "solo").then((res) => console.log(res))