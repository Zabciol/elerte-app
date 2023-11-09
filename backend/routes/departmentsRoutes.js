const express = require("express");
const router = express.Router();
const departmentsModel = require("../models/departmentsModel");
const { verifyToken } = require("../db");

router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await departmentsModel.getDepartments();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

module.exports = router;
