const express = require("express");
const router = express.Router();
const ecpModel = require("../models/ecpModel");

router.post("/updateOrCreate", async (req, res) => {
  console.log("Api ecp");
  try {
    const data = req.body;
    const result = await ecpModel.updateOrCreate(data);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
