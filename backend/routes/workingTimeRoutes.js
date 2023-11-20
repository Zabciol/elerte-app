const express = require("express");
const router = express.Router();
const workingTimeModel = require("../models/workingTime");
const { verifyToken } = require("../db");
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await workingTimeModel.getWorkingTime();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.get("/holidays", verifyToken, async (req, res) => {
  try {
    const year = req.query.year;
    const month = req.query.month;
    const results = workingTimeModel.getHolidaysForMonth(year, month);
    res.json(results);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error.message || "Wystąpił błąd podczas pobierania świąt.");
  }
});
module.exports = router;
