const mysql = require("mysql");
const config = require("../config");

const connection = mysql.createConnection(config.dbConnectionStr);

function queryDatabase(query, params, callback) {
  connection.query(query, params, callback);
}

const queryDatabasePromise = (query, data) => {
  return new Promise((resolve, reject) => {
    queryDatabase(query, data, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  queryDatabase,
  queryDatabasePromise,
};
