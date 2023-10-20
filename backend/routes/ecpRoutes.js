const express = require("express");
const router = express.Router();
const ecpModel = require("../models/ecpModel");

router.post("/SentECPToDatabase", async (req, res) => {
  console.log("Api ecp");
  try {
    const data = req.body;
    console.log(data);
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

module.exports = router;
