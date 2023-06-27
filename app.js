const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")
const { getAllEndpoints } = require("./controllers/endpoints.controller")
const { getAllArticles } = require("./controllers/articles.controller")

const app = express()

app.get("/api/topics", getAllTopics)

app.get("/api/", getAllEndpoints)

app.get("/api/articles", getAllArticles)


app.all(("*"),(request, response) => {
    response.status(404).send({msg: "Not Found"})
})
module.exports = app