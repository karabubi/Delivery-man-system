const express = require("express");
const { getRoute } = require("../Controller/routeController");
const router = express.Router();

router.post("/route", getRoute);

module.exports = router;
