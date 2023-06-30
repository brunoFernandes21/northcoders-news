const db = require("../db/connection");

exports.selectAllArticles = (topic) => {
  let queryString =
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ";

  const queryValues = [];
 
  if (topic) {
    queryString += "WHERE topic = $1 GROUP BY articles.article_id";
    queryValues.push(topic);
  } else {
    queryString += "GROUP BY articles.article_id"
  }

  return db.query(queryString, queryValues).then(({ rows }) => {
    console.log(rows.length)
    return rows;
  });
};

exports.selectArticleById = (id) => {
  const queryString = "SELECT * FROM articles WHERE article_id = $1";
  return db.query(queryString, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
  });
};

exports.selectUpdatedArticle = (article_id, newVote) => {
  const queryString =
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *";
  const queryValues = [newVote, article_id];

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return rows[0];
  });
};
