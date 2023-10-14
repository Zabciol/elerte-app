const express = require("express");
const bcrypt = require("bcrypt");
const employeesModel = require("../models/employeesModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const { id } = req.query;
  console.log(id);
  console.log("Próba uzyskania danych podwładnych");
  const subordinates = await getSubordinatesRecursively(id);
  res.status(200).send({ message: "Subordinates found!", data: subordinates });
});

async function getSubordinatesRecursively(id) {
  const subordinates = [];
  const results = await new Promise((resolve, reject) => {
    employeesModel.getSubordinates(id, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  for (let i = 0; i < results.length; i++) {
    subordinates.push(results[i]);
    const childSubordinates = await getSubordinatesRecursively(results[i].ID);
    subordinates.push(...childSubordinates);
  }

  return subordinates;
}

module.exports = router;
