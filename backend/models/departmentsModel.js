const db = require("../db");
const { queryDatabase, queryDatabasePromise } = require("../db");

const getDepartments = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Dzialy";
    queryDatabase(query, [], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};
module.exports = {
  getDepartments,
};
