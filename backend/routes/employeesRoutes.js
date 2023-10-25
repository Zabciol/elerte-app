const express = require("express");
const bcrypt = require("bcrypt");
const employeesModel = require("../models/employeesModel");
const router = express.Router();

async function getSubordinatesRecursively(id) {
  const subordinates = [];
  const results = await new Promise((resolve, reject) => {
    employeesModel.getSubordinates(id, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  for (let i = 0; i < results.length; i++) {
    subordinates.push(results[i]);
    const childSubordinates = await getSubordinatesRecursively(results[i].ID);
    subordinates.push(...childSubordinates);
  }

  return subordinates;
}
router.get("/", async (req, res) => {
  const { id } = req.query;
  console.log(id);
  console.log("Próba uzyskania danych podwładnych");
  const subordinates = await getSubordinatesRecursively(id);
  res.status(200).send({ message: "Subordinates found!", data: subordinates });
});

router.get("/supervisors", async (req, res) => {
  try {
    const result = await employeesModel.getSupervisors();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.get("/worked-hours-by-employee", async (req, res) => {
  try {
    const employeeId = req.query.employeeId;
    const month = req.query.month;

    if (!employeeId || !month) {
      return res
        .status(400)
        .send("Brak wymaganych parametrów: employeeId lub month.");
    }

    const result = await employeesModel.getWorkedHoursByEmployee(
      employeeId,
      month
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});
router.get("/inf", async (req, res) => {
  try {
    const employeeId = req.query.employeeId;

    if (!employeeId) {
      return res
        .status(400)
        .send("Brak wymaganych parametrów: employeeId lub month.");
    }

    const result = await employeesModel.getEmployeeInf(employeeId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});
router.get("/all", async (req, res) => {
  try {
    const result = await employeesModel.getAllEmployees();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});
router.post("/add", async (req, res) => {
  try {
    const employee = req.body;
    const result = await employeesModel.addNewEmployee(employee);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
