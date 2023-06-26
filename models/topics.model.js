const db = require("../db/connection")
exports.selectAllTopics = () => {
    const queryString = "SELECT * FROM topics";
    return db.query(queryString).then(({ rows }) => {
        return rows
    })
}