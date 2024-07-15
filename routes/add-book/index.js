const express = require('express');
const router = express.Router();
const { bookController, commentController } = require("../../controllers");
const { authMiddleware, loggedInMiddleware } = require("../../middlewares");

router.get('/', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.displayBooks);
router.get('/add-book', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.addBookForm);
router.get('/return', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.returnBook);
router.get('/edit-book/:BookId', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.editBookForm); 
router.get('/edit-comment', loggedInMiddleware.loggedIn, authMiddleware.auth, commentController.editCommentForm);
router.get('/add-comment', loggedInMiddleware.loggedIn, authMiddleware.auth, commentController.addCommentForm);

router.post('/add-book', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.addBook);
router.post('/borrow/:BookId', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.borrowBook);
router.post('/return/:BookId', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.returnBook);
router.post('/edit-book/:BookId', loggedInMiddleware.loggedIn, authMiddleware.auth, bookController.editBook); 
router.post('/edit-comment/:comment_id', loggedInMiddleware.loggedIn, authMiddleware.auth, commentController.editComment);
router.post('/add-comment/:comment_id', loggedInMiddleware.loggedIn, authMiddleware.auth, commentController.addComment);

module.exports = router;
