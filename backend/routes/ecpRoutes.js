const express = require("express");
const ECP = require("../models/ecpModel");

const router = express.Router();

router.post("/updateOrCreate", async (req, res) => {
  try {
    const { data, ...values } = req.body;

    const exists = await ECP.checkIfExists(data);
    if (exists) {
      await ECP.update(data, values);
      return res.send("Record updated");
    } else {
      await ECP.insert(req.body);
      return res.send("Record inserted");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
