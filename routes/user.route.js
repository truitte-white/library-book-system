const express = require('express');
const router = express.Router();
const { userController } = require("../controllers");
const {authMiddleware, loggedInMiddleware} = require("../middlewares");

// GET requests
router.get('/login', loggedInMiddleware.loggedIn, userController.getLoginForm);
router.get('/signup', loggedInMiddleware.loggedIn, userController.getSignupForm);
router.get('/profile', loggedInMiddleware.loggedIn, authMiddleware.auth, userController.getProfile);
router.get('/logout', loggedInMiddleware.loggedIn, userController.logout);

// POST requests
router.post('/login', loggedInMiddleware.loggedIn, userController.login);
router.post('/signup', loggedInMiddleware.loggedIn, userController.signup);

module.exports = router;


