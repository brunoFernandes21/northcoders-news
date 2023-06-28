const db = require("../db/connection");

exports.insertComments = (comment, article_id) => {
  const queryString =
    "INSERT INTO comments (author, body, article_id) VALUES($1, $2, $3) RETURNING *";

  const queryValues = Object.values(comment);
  queryValues.push(article_id);
  if (queryValues.length < 3) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    return db.query(queryString, queryValues).then(({ rows }) => {
      return rows[0];
    });
  }
};
