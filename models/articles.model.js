const db = require("../db/connection")

exports.selectArticleById = ( id ) => {
    const queryString = "SELECT * FROM articles WHERE article_id = $1";
    return db.query(queryString, [id]).then(( { rows}) => {
        // if(rows.length === 0) {
        //     return Promise.reject({status: 404, msg: "Bad request"})
        // }
        return rows[0]
    })
}