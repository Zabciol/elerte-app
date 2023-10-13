const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/employeesModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const { id } = req.body;
  var subordinates = [];
  userModel.getSubordinates(id, (err, results) => {
    while (results) {
      subordinates = subordinates.concat(results);
      for (let i = 0; results.length; i++) {
        userModel.getSubordinates(results[i].Podwladny_ID);
      }
    }
  });
  res
    .status(200)
    .send({ message: "Subordinates found!", subordinates: subordinates });
});

module.exports = router;
