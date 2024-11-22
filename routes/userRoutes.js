const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register route
router.post('/register', userController.register);

// Login route
router.post('/login', userController.login);

// Get all users route
router.get('/users', userController.getUsers);

module.exports = router;
