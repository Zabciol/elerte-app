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
    const query = `INSERT INTO Dzialy (Nazwa) VALUES (?)`;
    await queryDatabasePromise(query, name);
    return { success: true, message: "Dodano dział." };
  } catch (error) {
    throw new Error(error);
  }
};

const showDepartment = async (department) => {
  try {
    console.log(department);
    const query = `SELECT * FROM ECP 
    LEFT JOIN Pracownicy ON ECP.Pracownik_ID = Pracownicy.ID 
    LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID 
    LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID 
    WHERE Powod_ID > 0 AND Powod_ID != 40 AND Powod_ID != 41 AND Powod_ID != 42 AND Dzialy.Nazwa = ?;`;
    const response = await queryDatabasePromise(query, department);
    if (response.length)
      return { success: true, message: "Pokaz dzial.", dzial: department };
    else return { success: false, message: "Ukryj dzial.", dzial: department };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getDepartments,
  addDepartment,
  showDepartment,
};
