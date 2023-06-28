const { selectCommentsByArticleId } = require("../models/comments.model");
const { checkIfExists } = require("../utils/checkIfExists");

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
