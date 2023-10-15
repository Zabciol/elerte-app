const express = require("express");
const reasonsModel = require("../models/reasonsModel");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Próba uzyskania przyczyn nieobecnosci");

  reasonsModel.getReasons((err, reasons) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Server Error" });
    }
    res.status(200).send({ message: "Reasons found!", data: reasons });
  });
});

module.exports = router;
