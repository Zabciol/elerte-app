const { query } = require("express");
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

const addDepartment = async (name) => {
  try {
    const query = `INSERT INTO Dzialy (nazwa) VALUES (?)`;
    await queryDatabasePromise(query, name);
    return { success: true, message: "Dodano dział." };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getDepartments,
  addDepartment,
};
