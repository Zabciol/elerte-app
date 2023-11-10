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
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
