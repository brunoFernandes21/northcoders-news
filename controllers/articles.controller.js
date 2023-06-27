const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
    const { article_id: id } = request.params;
    selectArticleById(id).then((article) => {
      response.status(200).send({ article });
    }).catch(next);
  };
