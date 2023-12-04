const express = require("express");
const router = express.Router();
const analiticsModel = require("../models/analiticsModel");
const { verifyToken } = require("../db");

router.get("/countEmployeesOnPosition", verifyToken, async (req, res) => {
  try {
    const id = req.query.positionID;
    const dates = req.query.dates;
    if (!id) {
      return res.status(400).send("Brak wymaganych parametrów: data");
    }

    const result = await analiticsModel.countOfEmployeesOnPosition(id, dates);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});
router.get("/countEmployeesOnDepartment", verifyToken, async (req, res) => {
  try {
    const id = req.query.departmentID;
    const dates = req.query.dates;
    if (!id) {
      return res.status(400).send("Brak wymaganych parametrów: data");
    }

    const result = await analiticsModel.countOfEmployeesOnDepartment(id, dates);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

module.exports = router;
