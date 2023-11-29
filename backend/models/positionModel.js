const { queryDatabase, queryDatabasePromise } = require("../db");

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

const addPosition = async (newPosition) => {
  try {
    const query = `INSERT INTO Stanowisko (Nazwa, Dzial_ID) VALUES (?,?)`;
    await queryDatabasePromise(query, [newPosition.name, newPosition.Dzial_ID]);
    return { success: true, message: "Dodano stanowisko." };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getPositionByID,
  addPosition,
};
