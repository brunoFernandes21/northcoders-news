const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")
const { getAllEndpoints } = require("./controllers/endpoints.controller")
const { getArticleById, getAllArticles, getUpdatedArticle } = require("./controllers/articles.controller")
const { getCommentsByArticleId, postComments, deleteComment } = require("./controllers/comments.controller")
const { handlePsqlErrors, handleCustomerErrors } = require("./errors")
const { getAllUsers } = require("./controllers/users.controller")

const app = express()

app.use(express.json())

app.get("/api/topics", getAllTopics)

app.get("/api/", getAllEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.get("/api/users", getAllUsers)

app.post("/api/articles/:article_id/comments", postComments)

app.patch("/api/articles/:article_id", getUpdatedArticle)

app.delete("/api/comments/:comment_id", deleteComment)

app.all(("*"),(request, response) => {
    response.status(404).send({msg: "Not Found"})
})

app.use(handleCustomerErrors)
app.use(handlePsqlErrors)


module.exports = app