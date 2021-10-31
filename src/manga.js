import axios from 'axios'
import cheerio from 'cheerio'

const MAIN_URL = 'https://mangakakalot.com/'

const latest_manga_path = 'manga_list'


export const scrapeLatestManga = async({ list, type = "latest", category = "all", state = "all", page = 1 }) => {
    try {
        for (let i = 1; i < page + 1; i++) {
            const latestPage = await axios.get(`${MAIN_URL + latest_manga_path}?type=${type}&category=${category}$state=${state}&page=${i}`)
            const $ = cheerio.load(latestPage.data)


            $('div.leftCol.listCol > div > div.list-truyen-item-wrap').each((i, el) => {
                list.push({
                    title: $(el).find('h3 > a').text().trim(),
                    chapter: $(el).find('a.list-story-item-wrap-chapter').text().trim(),
                    src: $(el).find('a').attr('href'),
                    synopsis: $(el).find('p').text().replace('More.', '').replace(/\n/g, '').trim(),
                    views: $(el).find('div > span').text().trim()
                })
            })
        }
        return list
    } catch (err) {
        console.log(err)
    }
}

// scrapeLatestManga({
//     list: [],
//     page: 3
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