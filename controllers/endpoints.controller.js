const endpoints = require("../endpoints.json");
const { selectArticleById } = require("../models/articles.model");

exports.getAllEndpoints = (request, response) => {
  const apiDocs = { ...endpoints };
  response.status(200).send(apiDocs);
};

exports.getArticleById = (request, response, next) => {
  const { article_id: id } = request.params;
  selectArticleById(id).then((article) => {
    response.status(200).send({ article });
  }).catch(next);
};
