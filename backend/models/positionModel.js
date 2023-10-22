const { queryDatabase } = require("../db");

const getPositionByID = (Dzial_ID) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Stanowisko WHERE Stanowisko.Dzial_ID = ?`;

    queryDatabase(query, [Dzial_ID], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

module.exports = {
  getPositionByID,
};
