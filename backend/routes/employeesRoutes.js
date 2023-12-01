const express = require("express");
const bcrypt = require("bcrypt");
const employeesModel = require("../models/employeesModel");
const router = express.Router();
const { verifyToken } = require("../db");

async function getSubordinatesRecursively(id) {
  const subordinates = [];
  const stack = [id]; // Użyj stosu do śledzenia podwładnych

  while (stack.length > 0) {
    try {
      const currentId = stack.pop();
      const results = await employeesModel.getSubordinates(currentId);

      for (let i = 0; i < results.length; i++) {
        const subordinate = results[i];
        subordinates.push(subordinate);
        stack.push(subordinate.ID); // Dodaj podwładnego do stosu do dalszego przetwarzania
      }
    } catch (error) {
      // Obsłuż błąd pobierania podwładnych
      console.error(`Błąd podczas pobierania podwładnych: ${error.message}`);
    }
  }

  return subordinates;
}

router.get("/", verifyToken, async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send("Brak parametru 'id'.");
    }

    const subordinates = await getSubordinatesRecursively(id);
    console.log(subordinates);
    res.status(200).send({
      supervisor: subordinates.length > 0 ? true : false,
      message: "Subordinates found!",
      data: subordinates,
    });
  } catch (error) {
    console.error(`Wystąpił błąd: ${error.message}`);
    res.status(500).send("Wystąpił błąd podczas przetwarzania żądania.");
  }
});

router.get("/supervisors", verifyToken, async (req, res) => {
  try {
    const result = await employeesModel.getSupervisors();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.get("/worked-hours-by-employee", verifyToken, async (req, res) => {
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
router.get("/inf", verifyToken, async (req, res) => {
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
router.get("/all", verifyToken, async (req, res) => {
  try {
    const result = await employeesModel.getAllEmployees();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});
router.post("/add", verifyToken, async (req, res) => {
  try {
    const employee = req.body;
    const result = await employeesModel.addNewEmployee(employee);
    res.send(result);
  } catch (err) {
    res.status(500).send("Wystąpił błąd podczas dodawania danych.");
  }
});
router.get("/mySupervisor", verifyToken, async (req, res) => {
  try {
    const myID = req.query.myID;
    const result = await employeesModel.getAllMySupervisors(myID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.get("/mySupervisors", verifyToken, async (req, res) => {
  try {
    const myID = req.query.myID;
    const result = await employeesModel.getAllMySupervisors(myID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.post("/updateEmployee", verifyToken, async (req, res) => {
  try {
    await employeesModel.updateEmployee(req.body);
    res.send({
      message: "Dane pracownika i jego hierarchia zostały zaktualizowane.",
    });
  } catch (error) {
    res
      .status(500)
      .send("Wystąpił błąd podczas aktualizacji danych pracownika.");
  }
});

router.get("/myDirectSubordinates", verifyToken, async (req, res) => {
  try {
    const myID = req.query.myID;
    const result = await employeesModel.getMyDirectSubordinates(myID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

module.exports = router;
