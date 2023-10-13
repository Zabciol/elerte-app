const mysql = require("mysql");
const config = require("../config");

const connection = mysql.createConnection(config.dbConnectionStr);

function queryDatabase(query, params, callback) {
  connection.query(query, params, callback);
}

module.exports = {
  queryDatabase,
};
