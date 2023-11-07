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
    const ID = req.body.ID;
    const result = await requestModel.updateRequestsView(ID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas aktualizacji danych.");
  }
});

router.put("/accept", async (req, res) => {
  try {
    const ID = req.body.ID;
    const request = req.body.request;
    const result = await requestModel.acceptRequests(ID);
    const resultECP = await requestModel.fillECP(request);
    if (!resultECP.success) {
      throw new Error("Operacja wypełnienia tabeli ECP nie powiodła się.");
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas aktualizacji danych.");
  }
});
router.put("/decline", async (req, res) => {
  try {
    const ID = req.body.ID;
    const request = req.body.request;
    const result = await requestModel.declineRequests(ID);
    const resultECP = await requestModel.deleteECP(request);
    if (!resultECP.success) {
      throw new Error(
        "Operacja usuwania danych z tabeli ECP nie powiodła się."
      );
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas aktualizacji danych.");
  }
});
router.get("/getAccepted", async (req, res) => {
  try {
    const date = req.query.date;
    const IDs = req.query.IDs;
    const result = await requestModel.getAcceptedRequests(date, IDs);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

module.exports = router;
