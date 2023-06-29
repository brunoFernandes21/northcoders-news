const db = require("../db/connection");

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

