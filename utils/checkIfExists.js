const db = require("../db/connection");
const format = require('pg-format');

exports.checkIfExists = ( table, column, value ) => {
    const queryString = format("SELECT * FROM %I WHERE %I = $1", table, column);
    const queryValue = [value]
    return db.query(queryString, queryValue).then(({ rows }) => {
      if(rows.length === 0) {
        return Promise.reject({status: 404, msg: "Not Found"})
      }
    })
  }