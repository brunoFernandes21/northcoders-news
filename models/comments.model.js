const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  const queryString = "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC";
  const queryValue = [article_id]
  return db.query(queryString, queryValue).then(( { rows }) => {
    return rows
  })
}

exports.insertComments = (comment, article_id) => {
  const queryString =
    "INSERT INTO comments (author, body, article_id) VALUES($1, $2, $3) RETURNING *";

  const queryValues = [comment.username, comment.body, article_id];
  return db.query(queryString, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return rows[0];
  });
};

exports.deleteCommentById = (comment_id) => {
  const queryString = "DELETE FROM comments WHERE comment_id = $1 RETURNING *";

  return db.query(queryString, [comment_id]).then(({ rows }) => {
    if(rows.length === 0){
      return Promise.reject({status: 404, msg: "Not Found"})
    }
    return rows[0]
  })
}
