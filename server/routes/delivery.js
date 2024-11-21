const express = require("express");
const getDelivery = require("../Controller/getDelivery");
const router = express.Router();

router.get("/", (req, res) => {
  getDelivery(req, res);
});

module.exports = router;
