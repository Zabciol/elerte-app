const { queryDatabase, queryDatabasePromise } = require("../db");

const getReasons = (callback) => {
  queryDatabase("SELECT * from PowodyNieobecnosci", [], callback);
};

const getReasonByID = async (id) => {
  const results = await queryDatabasePromise(
    "SELECT ID, Nazwa AS `Powod` FROM PowodyNieobecnosci WHERE ID = ?",
    [id]
  );

  // Zwróć pierwszy element tablicy wyników, jeśli istnieje
  return results.length > 0 ? results[0] : null;
};

module.exports = {
  getReasons,
  getReasonByID,
};
