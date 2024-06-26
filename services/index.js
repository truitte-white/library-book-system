const bookService = require("./book.service");
const userService = require("./user.service");
const commentService = require("./comment.service");
const borrowerService = require("./borrow.service");
const returnService = require("./return.service");

module.exports = {
    bookService,
    userService,
    commentService,
    borrowerService,
    returnService 
}