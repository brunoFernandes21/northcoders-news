const { selectArticleById, selectAllArticles, selectCommentsByArticleId } = require("../models/articles.model");

exports.getAllArticles = (request, response) => {
  selectAllArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

exports.getArticleById = (request, response, next) => {
    const { article_id: id } = request.params;
    selectArticleById(id).then((article) => {
      response.status(200).send({ article });
    }).catch(next);
  };

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params
  selectCommentsByArticleId(article_id).then((comments) => {
    response.status(200).send({comments})
  }).catch(next)
}