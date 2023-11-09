const { queryDatabase, queryDatabasePromise } = require("../db");

const getWorkingTime = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * from WymiarPracy`;

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
  getWorkingTime,
};
