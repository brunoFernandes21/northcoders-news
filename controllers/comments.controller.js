const { insertComments } = require("../models/comments.model")

exports.postComments = (request, response) => {
    const { article_id } = request.params
    const comment = request.body

    insertComments(comment, article_id).then(( newComment ) => {
        response.status(201).send({comment: newComment})
    })
}