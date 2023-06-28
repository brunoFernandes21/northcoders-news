const db = require("../db/connection");

exports.insertComments = (comment, article_id) => {
  const queryString =
    "INSERT INTO comments (author, body, article_id) VALUES($1, $2, $3) RETURNING *";

  const queryValues = [comment.username, comment.body, article_id];

  if (queryValues.includes(undefined)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    return db.query(queryString, queryValues).then(({ rows }) => {
      return rows[0];
    });
  }
};
