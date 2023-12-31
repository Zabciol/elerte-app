const express = require("express");
const requestModel = require("../models/requestsModel");
const router = express.Router();
const { verifyToken, getSecretKey } = require("../db");
const jwt = require("jsonwebtoken");

router.post("/new", verifyToken, async (req, res) => {
  try {
    const request = req.body;
    const result = await requestModel.sentRequest(request);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/get", verifyToken, async (req, res) => {
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

router.get("/accept", async (req, res) => {
  try {
    const tokenData = jwt.verify(req.query.token, getSecretKey());
    const ID = tokenData.id;
    const data_od = new Date(tokenData.data_od);
    const current_date = new Date();
    if (current_date >= data_od) {
      throw new Error("Skończył się czas na akceptacje wniosku");
    }
    const result = await requestModel.acceptRequests(ID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error.message || "Wystąpił błąd podczas akceptowania wniosku.");
  }
});
router.get("/decline", async (req, res) => {
  try {
    const tokenData = jwt.verify(req.query.token, getSecretKey());
    const ID = tokenData.id;
    const data_od = new Date(tokenData.data_od);
    const current_date = new Date();
    if (current_date >= data_od) {
      throw new Error("Skończył się czas na akceptacje wniosku");
    }
    //const request = await requestModel.getRequestByID(ID);
    const result = await requestModel.declineRequests(ID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(error.message || "Wystąpił błąd podczas odrzucania Wniosku.");
  }
});
router.get("/getAccepted", verifyToken, async (req, res) => {
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
