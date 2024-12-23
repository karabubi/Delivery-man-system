
const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const router = express.Router();
const {
  findDelivery,
  addDelivery,
} = require("../Controller/deliveryController.js");

router.get("/", ClerkExpressRequireAuth(), (req, res) => {
  const userId = req.auth.userId;
  getDelivery(req, res, userId);
});

router.get("/findDelivery", ClerkExpressRequireAuth(), (req, res) => {
  const userId = req.auth.userId;
  findDelivery(req, res, userId);
});

router.post("/addDelivery", ClerkExpressRequireAuth(), (req, res) => {
  const userId = req.auth.userId;
  addDelivery(req, res, userId);
});

module.exports = router;