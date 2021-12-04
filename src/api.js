import express from 'express'
import cors from 'cors'

import {
    scrapeChapter,
    scrapeManga,
    scrapeMangaInfo,
    scrapeSearchQuery
} from './manga_parser.js'


const port = process.env.PORT || 3000;

const corsOptions = {
    origin: "*",
    credentails: true,
    optionSuccessStatus: 200,
    port: port,
}

const app = express();


app.use(cors(corsOptions))
app.use(express.json())

app.get("/", async(req, res) => {
    res.status(200).json('Welcome to Mangato API!')
})


app.get("/manga_list", async(req, res) => {
    let list = []
    try {
        const sts = req.query.sts
        const orby = req.query.orby
        const page = req.query.page
        const inGenre = req.query.inGenre
        const exGenre = req.query.exGenre
        const keyw = req.query.keyw

        await scrapeManga({
            list: list,
            sts: sts,
            orby: orby,
            inGenre: inGenre,
            exGenre: exGenre,
            keyw: keyw,
            page: page,
        })
        res.status(200).json(list)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal error."
        })
        console.log(err)
    }
})

app.get("/manga_info", async(req, res) => {
    let list = []
    try {
        const url = req.headers['url']
        const id = req.query.id
        const hostName = req.headers['host-name']

        var result = await scrapeMangaInfo({ list: list, src: url, id: id, hostName: hostName })
        if (typeof result !== 'object') {
            return res.status(400).json({
                status: 400,
                error: "Bad Request."
            })
        }

        res.status(200).json(list)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal error."
        })
        console.log(err)

    }
})

app.get('/read_manga', async(req, res) => {
    let list = []
    try {
        const chapterUrl = req.headers['url']
        await scrapeChapter({ list: list, chapterUrl: chapterUrl })
        res.status(200).json(list)
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal error."
        })
        console.log(err)
    }
})

app.get("/manga_search", async(req, res) => {
    let list = []
    try {
        const query = req.query.find
        const s = req.query.s
        const sts = req.query.sts
        const orderBy = req.query.orby
        await scrapeSearchQuery({
            searchInfo: list,
            query: query,
            s: s,
            sts: sts,
            orby: orderBy
        })
        res.status(200).json(list)

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Internal error."
        })
        console.log(err)
    }
})


app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        error: "Not Found"
    })
})


app.listen(port, () => {
    console.log(
        "Express server listening on port %d in %s mode",
        port,
        app.settings.env
    )
})