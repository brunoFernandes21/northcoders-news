const { selectAllArticles } = require("../models/articles.model");

exports.getAllArticles = (request, response) => {
  selectAllArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};
