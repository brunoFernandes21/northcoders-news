const { selectArticleById, selectAllArticles, selectCommentsByArticleId } = require("../models/articles.model");
const { checkIfExists } = require("../utils/checkIfExists");

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

  const promisesArray = [selectCommentsByArticleId(article_id)]
  
  if(article_id) {
    promisesArray.push(checkIfExists("articles", "article_id",  article_id))
  }
  Promise.all(promisesArray).then((revolvedPromises) => {
    const comments = revolvedPromises[0]
    response.status(200).send({comments})
  }).catch(next)
}