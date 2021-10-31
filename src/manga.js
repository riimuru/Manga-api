import axios from 'axios'
import cheerio from 'cheerio'

const MAIN_URL = 'https://mangakakalot.com/'

const latest_manga_path = 'manga_list'


export const scrapeLatestManga = async({ list, type = "latest", category = "all", state = "all", page = 1 }) => {
    try {
        let data = []
        var totalStories = ''
        var totalPages = ''
        let index = 0
        for (let i = 1; i < page + 1; i++) {
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
//     page: 1
// }).then((res) => console.log(res))


export const scrapeMangaInfo = async(url) => {
    try {
        const main = await axios.get(url);
        const $ = cheerio.load(main.data)

        $('body > div.body-site > div.container-chapter-reader > img').each((i, el) => {
            console.log({
                img: $(el).attr('src'),
                title: $(el).attr('title')
            })
        })

    } catch (err) {
        console.log(err)
    }
}

// scrapeMangaInfo('https://readmanganato.com/manga-dr980474/chapter-0')