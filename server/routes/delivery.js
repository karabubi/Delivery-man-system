const express = require("express");
const getDelivery = require("../Controller/getDelivery.js");
const router = express.Router();
const {
  findDelivery,
  addDelivery,
} = require("../Controller/deliveryController.js");

router.get("/", (req, res) => {
  getDelivery(req, res);
});

router.get("/findDelivery", findDelivery);
router.post("/addDelivery", addDelivery);

module.exports = router;
