const mysql = require("mysql");
const config = require("../config");

const connection = mysql.createConnection(config.db);

function queryDatabase(query, params, callback) {
  console.log("DB module loaded!");
  connection.query(query, params, callback);
}

module.exports = {
  queryDatabase,
};
