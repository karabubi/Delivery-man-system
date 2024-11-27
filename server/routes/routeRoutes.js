const express = require("express");
const { getRoute } = require("../Controller/routeController");
const router = express.Router();

router.post("/route", getRoute);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { getRoute } = require('../controllers/routeController');

// router.post('/', getRoute);

// module.exports = router;
