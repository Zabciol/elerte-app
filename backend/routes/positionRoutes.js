const express = require("express");
const router = express.Router();
const positionModel = require("./../models/positionModel");

router.get("/", async (req, res) => {
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

module.exports = router;
