const { insertComments } = require("../models/comments.model");

exports.postComments = (request, response, next) => {
  const { article_id } = request.params;
  const comment = request.body;

  insertComments(comment, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};
