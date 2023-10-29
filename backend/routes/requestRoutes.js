const express = require("express");
const requestModel = require("../models/requestsModel");
const router = express.Router();

router.post("/new", async (req, res) => {
  try {
    const request = req.body;
    const result = await requestModel.sentRequest(request);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
