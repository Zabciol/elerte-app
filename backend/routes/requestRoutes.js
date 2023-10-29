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
router.get("/get", async (req, res) => {
  try {
    const myID = req.query.myID;
    const result = await requestModel.getRequests(myID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});
router.put("/updateView", async (req, res) => {
  try {
    const ID = req.query.ID;
    const result = await requestModel.updateRequestsView(ID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas aktualizacji danych.");
  }
});

module.exports = router;
