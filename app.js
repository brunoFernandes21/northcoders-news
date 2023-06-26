const express = require("express")
const { getAllTopics } = require("./controllers/topics.controller")

const app = express()

app.get("/api/topics", getAllTopics)

app.all(("*"),(request, response) => {
    response.status(404).send({msg: "Not Found"})
})
module.exports = app