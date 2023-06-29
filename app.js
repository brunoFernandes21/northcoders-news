const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")
const { getAllEndpoints } = require("./controllers/endpoints.controller")
const { getArticleById } = require("./controllers/articles.controller")
const { getAllArticles } = require("./controllers/articles.controller")
const { postComments } = require("./controllers/comments.controller")
const { handlePsqlErrors, handleCustomerErrors } = require("./errors")

const app = express()

app.use(express.json())

app.get("/api/topics", getAllTopics)

app.get("/api/", getAllEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getAllArticles)

app.post("/api/articles/:article_id/comments", postComments)

app.all(("*"),(_, response) => {
    response.status(404).send({msg: "Not Found"})
})

app.use(handleCustomerErrors)
app.use(handlePsqlErrors)


module.exports = app