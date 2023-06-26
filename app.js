const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")
const { getAllEndpoints, getArticleById } = require("./controllers/endpoints.controller")

const app = express()

app.get("/api/topics", getAllTopics)

app.get("/api/", getAllEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.all(("*"),(request, response) => {
    response.status(404).send({msg: "Not Found"})
})

app.use((err, request, response, next) => {
    response.status(400).send({msg: "Bad request"})
})
module.exports = app