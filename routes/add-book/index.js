const express = require('express');
const router = express.Router();
const { bookController } = require("../../controllers");
const {authMiddleware} = require("../../middlewares");

// Calls the book controller to the home page
router.get('/', bookController.displayBooks);

// Calls the book controller to create the add book form
router.get('/add-book', authMiddleware.auth, bookController.addBookForm);

// Calls the book controller to insert the book data into the database
router.post('/add-book', authMiddleware.auth, bookController.addBook);
router.post('/borrow/:book_id', authMiddleware.auth, bookController.borrowBook);

module.exports = router;

