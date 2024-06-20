const express = require('express');
const router = express.Router();
const { userController } = require("../controllers");
const {authMiddleware} = require("../middlewares");

// GET requests
router.get('/login', userController.getLoginForm);
router.get('/signup', userController.getSignupForm);
router.get('/profile', authMiddleware.auth, userController.getProfile);

// POST requests
router.post('/login', userController.login);
router.post('/signup', userController.signup);

module.exports = router;


