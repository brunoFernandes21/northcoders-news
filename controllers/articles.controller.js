const { selectArticleById } = require("../models/articles.model");
const { selectAllArticles } = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
    const { article_id: id } = request.params;
    selectArticleById(id).then((article) => {
      response.status(200).send({ article });
    }).catch(next);
  };
  
exports.getAllArticles = (request, response) => {
  selectAllArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};