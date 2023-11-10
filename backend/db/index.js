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
    res.status(500).send("Brak tokenu.");
  }
  try {
    const decoded = jwt.verify(token, getSecretKey());
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(500).send("Wymagane przelogowanie.");
    } else {
      console.error("Błąd weryfikacji tokena:", error);
      res.status(500).send("Napotkano problem przy uwierzytelnianiu.");
    }
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
