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

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]?.replace(/"/g, "");
  if (!token) {
    return res.status(401).send("No token provided");
  }
  try {
    const decoded = jwt.verify(token, getSecretKey());
    req.user = decoded; // Zapisujemy zdekodowane dane do obiektu żądania
    next(); // Przechodzimy do następnego middleware
  } catch (error) {
    console.error("Błąd weryfikacji tokena:", error);
    res.status(401).json({ isValid: false, error: error.message });
  }
};

const getSecretKey = () => {
  return secretKey;
};

module.exports = {
  queryDatabase,
  queryDatabasePromise,
  getSecretKey,
  verifyToken,
};
