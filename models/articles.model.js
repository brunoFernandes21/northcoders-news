const db = require("../db/connection");

exports.selectAllArticles = () => {
  const queryString =
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC";

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = ( id ) => {
    const queryString = "SELECT * FROM articles WHERE article_id = $1";
    return db.query(queryString, [id]).then(( { rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return rows[0]
    })
}

exports.selectCommentsByArticleId = (article_id) => {
  const queryString = "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC";
  const queryValue = [article_id]
  return db.query(queryString, queryValue).then(( { rows }) => {
    return rows
  })
}