const express = require("express");
const router = express.Router();
const ecpModel = require("../models/ecpModel");

router.post("/SentECPToDatabase", async (req, res) => {
  try {
    const data = req.body;
    const result = await ecpModel.SentECPToDatabase(data);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/checkECP/:employeeId/:date", async (req, res) => {
  try {
    const { employeeId, date } = req.params;
    const result = await ecpModel.checkECPForEmployeeOnDate(employeeId, date);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(200).json(result || null);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});
router.get("/ecp", async (req, res) => {
  try {
    const date = req.query.date;
    const employeesID = req.query.employeesID;
    if (!date) {
      return res.status(400).send("Brak wymaganych parametrów: data");
    }

    const result = await ecpModel.getECPForMonth(date, employeesID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

module.exports = router;
