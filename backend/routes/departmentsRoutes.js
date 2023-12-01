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

router.get("/show", verifyToken, async (req, res) => {
  try {
    const { department } = req.query; // Zmiana z req.params na req.query
    console.log("router: ", department);
    const result = await departmentsModel.showDepartment(department);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
