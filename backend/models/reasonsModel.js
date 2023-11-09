const { queryDatabase, queryDatabasePromise } = require("../db");

const getReasons = (callback) => {
  queryDatabase("SELECT * from PowodyNieobecnosci", [], callback);
  console.log("Wysłano zapytanie do bazy");
};

module.exports = {
  getReasons,
};
