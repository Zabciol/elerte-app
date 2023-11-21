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
router.post("/add", verifyToken, async (req, res) => {
  try {
    const newDepartment = req.body;

    const result = await departmentsModel.addDepartment(newDepartment.name);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
