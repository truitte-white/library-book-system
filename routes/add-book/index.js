const express = require('express');
const router = express.Router();
const { bookController } = require("../../controllers");
const {authMiddleware, loggedInMiddleware} = require("../../middlewares");

router.get('/', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.displayBooks);
router.get('/add-book', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.addBookForm);
router.post('/return/:book_id', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.returnBook);

router.post('/add-book', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.addBook);
router.post('/borrow/:book_id', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.borrowBook);

module.exports = router;

