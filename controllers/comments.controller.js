const { selectCommentsByArticleId, insertComments } = require("../models/comments.model");
const { checkIfExists } = require("../utils/checkIfExists");

exports.postComments = (request, response, next) => {
  const { article_id } = request.params;
  const comment = request.body;

  insertComments(comment, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
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
