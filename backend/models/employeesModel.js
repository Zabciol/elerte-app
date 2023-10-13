const { queryDatabase } = require("../db");

const getSubordinates = (id, callback) => {
  queryDatabase(
    "SELECT * FROM Hierarchia WHERE Przelozony_ID = ?",
    [id],
    callback
  );
  console.log(callback);
};

module.exports = {
  getSubordinates,
};
