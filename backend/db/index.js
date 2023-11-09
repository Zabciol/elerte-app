const mysql = require("mysql");
const config = require("../config");
const jwt = require("jsonwebtoken");
const secretKey =
  "37x!A%D*G-KaPdSgVkYp3s6v9y$B&E)H@McQfTjWnZr4u7w!z%C*F-JaNnRfUjXn";

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

const getSecretKey = () => {
  return secretKey;
};

module.exports = {
  queryDatabase,
  queryDatabasePromise,
  getSecretKey,
};
