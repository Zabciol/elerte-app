const express = require("express");
const reasonsModel = require("../models/reasonsModel");
const router = express.Router();
const { verifyToken } = require("../db");
router.get("/", verifyToken, (req, res) => {
  reasonsModel.getReasons((err, reasons) => {
    if (err) {
      console.error(err);
      res.status(500).send("Wystąpił błąd podczas pobierania danych.");
    }
    res.status(200).send({ message: "Reasons found!", data: reasons });
  });
});

module.exports = router;
