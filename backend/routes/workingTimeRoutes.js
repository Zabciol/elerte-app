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

module.exports = router;
