const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")
const { getAllEndpoints } = require("./controllers/endpoints.controller")
const { getArticleById } = require("./controllers/articles.controller")

const app = express()

app.get("/api/topics", getAllTopics)

app.get("/api/", getAllEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.all(("*"),(request, response) => {
    response.status(404).send({msg: "Not Found"})
})

app.use((err, request, response, next) => {
    if(err.code){
        response.status(400).send({msg: "Bad request"})
    }else{
        next(err)
    }
})
app.use((err, request, response, next) => { 
    if(err.msg)
    response.status(err.status).send({msg: err.msg})
})

module.exports = app