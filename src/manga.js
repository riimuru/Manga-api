import axios from 'axios'
import cheerio from 'cheerio'

const MAIN_URL = 'https://mangakakalot.com/'
const latest_manga_path = 'manga_list'


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
            updated: updated,
            views: views,
            synopsis: synopsis,
            genres: genresList,
            chapters: chapterList
        })

        return list


    } catch (err) {
        console.log(err)
    }
}

// let list = []
// scrapeMangaInfo('https://readmanganato.com/manga-bn978870', list).then((res) => console.log(res))