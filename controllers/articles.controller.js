const {
  selectArticleById,
  selectAllArticles,
  selectUpdatedArticle,
} = require("../models/articles.model");

exports.getAllArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query
  selectAllArticles(topic, sort_by, order).then((articles) => {
    response.status(200).send({articles})
  }).catch(err => next(err))
}

exports.getArticleById = (request, response, next) => {
  const { article_id: id } = request.params;
  selectArticleById(id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getUpdatedArticle = (request, response, next) => {
  const { article_id } = request.params
  const { inc_votes: newVote } = request.body
  
  selectUpdatedArticle(article_id, newVote).then((article) => {
    response.status(200).send({article})
  }).catch(next)
}