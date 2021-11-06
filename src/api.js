import express from 'express'
import jwt from "jsonwebtoken";
import cors from 'cors'

import {
    scrapeLatestManga,
    scrapeMangaInfo,
    scrapeSearchQuery
} from './manga.js'


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
    res.status(200).json('Welcome to Shonen Jump API!')
})


app.get("/manga_list", async(req, res) => {
    let list = []
    try {
        const type = req.query.type
        const category = req.query.category
        const state = req.query.state
        const page = req.query.page

        await scrapeLatestManga({
            list: list,
            type: type,
            category: category,
            state: state,
            page: page
        })
        res.status(200).json(list)

    } catch (err) {
        res.status(500).json({
            Error: "Internal error."
        })
        console.log(err)
    }
})

app.get("/manga_info", async(req, res) => {
    let list = []
    try {
        const url = req.headers['url']
        await scrapeMangaInfo(url, list)
        res.status(200).json(list)

    } catch (err) {
        res.status(500).json({
            Error: "Internal error."
        })
        console.log(err)

    }
})

app.get("/manga_search", async(req, res) => {
    let list = []
    try {
        const query = req.query.find
        await scrapeSearchQuery({
            searchInfo: list,
            query: query,
        })
        res.status(200).json(list)

    } catch (err) {
        res.status(500).json({
            Error: "Internal error."
        })
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(
        "Express server listening on port %d in %s mode",
        port,
        app.settings.env
    )
})