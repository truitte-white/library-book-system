const express = require('express');
const router = express.Router();
const { bookController } = require("../../controllers");
const {authMiddleware} = require("../../middlewares");

router.get('/', bookController.displayBooks);
router.get('/add-book', authMiddleware.auth, bookController.addBookForm);
router.post('/return/:book_id', authMiddleware.auth, bookController.returnBook);

router.post('/add-book', authMiddleware.auth, bookController.addBook);
router.post('/borrow/:book_id', authMiddleware.auth, bookController.borrowBook);

module.exports = router;

