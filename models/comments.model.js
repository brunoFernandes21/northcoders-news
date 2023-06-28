const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
    const queryString = "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC";
    const queryValue = [article_id]
    return db.query(queryString, queryValue).then(( { rows }) => {
      return rows
    })
  }