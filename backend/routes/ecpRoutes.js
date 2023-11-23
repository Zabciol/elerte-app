const express = require("express");
const router = express.Router();
const ecpModel = require("../models/ecpModel");
const { verifyToken } = require("../db");

router.post("/SentECPToDatabase", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const result = await ecpModel.SentECPToDatabase(data);
    res.send(result);
  } catch (err) {
    res.status(500).send("Wystąpił błąd podczas wysyłania danych danych.");
  }
});

router.get("/checkECP/:employeeId/:date", verifyToken, async (req, res) => {
  try {
    const { employeeId, date } = req.params;
    const result = await ecpModel.checkECPForEmployeeOnDate(employeeId, date);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(200).json(result || null);
    }
  } catch (error) {
    res.status(500).send("Wystąpił błąd podczas usuwania danych.");
  }
});
router.get("/ecp", verifyToken, async (req, res) => {
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
router.get("/export", verifyToken, async (req, res) => {
  try {
    const date = req.query.date;
    const employeesID = req.query.employeesID;
    if (!date) {
      return res.status(400).send("Brak wymaganych parametrów: data");
    }

    const result = await ecpModel.exportECPForMonth(date, employeesID, res);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});
router.get("/absence", verifyToken, async (req, res) => {
  try {
    const date = req.query.date;
    const employeesID = req.query.employeesID;
    if (!date) {
      return res.status(400).send("Brak wymaganych parametrów: data");
    }

    const result = await ecpModel.getAbsenceNotIncludeRequests(
      date,
      employeesID
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.post("/fillECPforDeletedEmployee", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, employeeID, editEmployeeID } = req.body;
    const result = await ecpModel.fillECPforDeletedEmployee(
      startDate,
      endDate,
      employeeID,
      editEmployeeID
    );
    res.send({
      message: "Poprawnie usunięto pracownika",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Wystąpił błąd podczas uzupełniania ECP");
  }
});
module.exports = router;
