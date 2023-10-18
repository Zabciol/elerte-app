const db = require("../database");

module.exports = {
  checkIfExists: (data) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) AS count FROM twoja_tabela WHERE data = ?";
      db.query(query, [data], (err, results) => {
        if (err) reject(err);
        resolve(results[0].count > 0);
      });
    });
  },

  update: (data, values) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE twoja_tabela SET ? WHERE data = ?";
      db.query(query, [values, data], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  insert: (values) => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO twoja_tabela SET ?";
      db.query(query, values, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
};
