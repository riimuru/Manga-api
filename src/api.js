import express from 'express'
import jwt from "jsonwebtoken";
import cors from 'cors'
import serverless from 'serverless-http'

import {
    scrapeLatestManga,
} from './manga.js'


const port = process.env.PORT || 3000;

const corsOptions = {
    origin: "*",
    credentails: true,
    optionSuccessStatus: 200,
    port: port,
}

const app = express();

const router = express.Router();

app.use(cors(corsOptions))
app.use(express.json())

router.get("/", async(req, res) => {
    res.status(200).json('Welcome to Shonen Jump API!')
})


router.get("/manga", async(req, res) => {
    let list = []
    try {
        const type = req.query.type
        const category = req.query.category
        const state = req.query.state
        const page = req.query.page

        await scrapeLatestManga(list, type, category, state, page)
        res.status(200).json(list)

    } catch (err) {
        console.log(err)
    }
})


app.use("/.netlify/functions/api", router)

app.listen(port, () => {
    console.log(
        "Express server listening on port %d in %s mode",
        port,
        app.settings.env
    )
})