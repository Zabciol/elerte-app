const express = require("express");
const bcrypt = require("bcrypt");
const employeesModel = require("../models/employeesModel");
const router = express.Router();

async function getSubordinatesRecursively(id) {
  const subordinates = [];
  const results = await employeesModel.getSubordinates(id);

  for (let i = 0; i < results.length; i++) {
    subordinates.push(results[i]);
    const childSubordinates = await getSubordinatesRecursively(results[i].ID);
    subordinates.push(...childSubordinates);
  }

  return subordinates;
}
router.get("/", async (req, res) => {
  const { id } = req.query;
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
router.get("/mySupervisor", async (req, res) => {
  try {
    const myID = req.query.myID;
    const result = await employeesModel.getMySupervisor(myID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.get("/mySupervisors", async (req, res) => {
  try {
    const myID = req.query.myID;
    const result = await employeesModel.getMySupervisors(myID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.post("/updateEmployee", async (req, res) => {
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

router.delete("/deleteEmployee/:id", async (req, res) => {
  try {
    await employeesModel.deleteEmployee(req.params.id);
    res
      .status(200)
      .send({ message: "Poprawnie usunięto pracownika z listy ECP" });
  } catch (error) {
    console.error("Error during employee deletion:", error);
    res.status(500).send({ message: "Napotkano problem podczas usuwania" });
  }
});

module.exports = router;
