const express = require("express");
const router = express.Router();
const positionModel = require("./../models/positionModel");
const { verifyToken } = require("../db");
router.get("/", verifyToken, async (req, res) => {
  try {
    const Dzial_ID = req.query.Dzial_ID;

    if (!Dzial_ID) {
      return res.status(400).send("Brak wymaganych parametrów: Dzial_ID");
    }

    const result = await positionModel.getPositionByID(Dzial_ID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

router.post("/add", verifyToken, async (req, res) => {
  try {
    const newPosition = req.body;

    const result = await positionModel.addPosition(newPosition);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
