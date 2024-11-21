const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Define routes and map to controller methods
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', userController.getUserDetails);

module.exports = router;
