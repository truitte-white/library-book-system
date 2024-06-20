const { bookService, fineService, borrowerService, returnService } = require("../services");

module.exports = {
    displayBooks: async (req, res, next) => {
        try {
            const books = await bookService.getAllBooks(next);
            return res.render("pages/books", { books });
        } catch (err) {
            console.error('Error displaying books: ' + err.stack);
            res.status(500).json({ error: 'Error displaying books' });
        }
    },
    addBookForm: (req, res, next) => {
        res.render('form/add-book');
    },
    addBook: async (req, res) => {
        console.log(req.body)
        try {
            const insertId = await bookService.addBook(req.body)
            console.log('Book inserted with ID: ' + insertId);
            return res.redirect("/books");
        } catch (err) {
            console.error('Error inserting book into database from controller: ' + err.stack);
            res.status(500).json({ error: 'Error inserting book into database from controller' });
        }
    },
    borrowBook: async (req, res, next) => {
        try {
            const { book_id } = req.params; // Accessing book_id from route parameters
            const userId = req.userId; // Assuming userId is retrieved from middleware or authentication

            console.log('UserId:', userId);
            console.log('BookId:', book_id);

            // Check if the book is already borrowed by the user
            const alreadyBorrowed = await borrowerService.findBorrowedBookById(userId, book_id);
            if (alreadyBorrowed && alreadyBorrowed.active) {
                res.locals.message = "User has already borrowed this book";
                console.error('User has already borrowed this book');
                return res.redirect("/books");
            }

            // Check if the book exists and is available
            const book = await bookService.findBookById(book_id);
            if (!book) {
                res.locals.message = "Book ID does not exist";
                console.error('Book ID does not exist');
                return res.redirect("/books");
            }
            if (book.book_status !== 'Available') {
                res.locals.message = `Book ${book.book_title} is not in stock`;
                console.error('Book is not in stock');
                return res.redirect("/books");
            }

            // Borrow the book (insert into books_borrowed table)
            await borrowerService.borrowBook({ user_id: userId, book_id });

            // Update book_status to 'Checked Out' in the books table
            await borrowerService.updateBookStatus(book_id, 'Checked Out');

            // Success message
            res.locals.message = `Successfully borrowed book ${book.book_title}`;
            res.redirect("/books");
        } catch (err) {
            console.error('Error:', err);
            next(err); // Ensure error is passed to the next middleware/handler
        }
    },

    // borrowBook: async (req, res, next) => {
    //     try {
    //         const { book_id } = req.params; // Accessing book_id from route parameters
    //         const userId = req.userId; // Assuming userId is retrieved from middleware or authentication

    //         console.log('UserId:', userId);
    //         console.log('BookId:', book_id);

    //         // Check if the book is already borrowed by the user
    //         const alreadyBorrowed = await borrowerService.findBorrowedBookById(userId, book_id);
    //         if (alreadyBorrowed && alreadyBorrowed.active) {
    //             res.locals.message = "User has already borrowed this book";
    //             console.error('User has already borrowed this book');
    //             return res.redirect("/books");
    //         }

    //         // Check if the book exists and is available
    //         const book = await bookService.findBookById(book_id);
    //         if (!book) {
    //             res.locals.message = "Book ID does not exist";
    //             console.error('Book ID does not exist');
    //             return res.redirect("/books");
    //         }
    //         if (book.book_status !== 'Available') {
    //             res.locals.message = `Book ${book.book_title} is not in stock`;
    //             console.error('Book is not in stock');
    //             return res.redirect("/books");
    //         }

    //         // Borrow the book (insert into books_borrowed table)
    //         await borrowerService.borrowBook({ user_id: userId, book_id });

    //         // Success message
    //         res.locals.message = `Successfully borrowed book ${book.book_title}`;
    //         res.redirect("/books");
    //     } catch (err) {
    //         console.error('Error:', err);
    //         next(err); // Ensure error is passed to the next middleware/handler
    //     }
    // },
    returnBook: async (req, res, next) => {
        const { book_id } = req.params;
        const userId = req.userId;

        try {
            // Check if the book is borrowed by the user and is active
            const borrowedBook = await borrowerService.findBorrowedBookById(userId, book_id);
            if (!borrowedBook || !borrowedBook.active) {
                res.locals.message = "Book is already returned or not borrowed by the user";
                return res.redirect("/user/profile");
            }

            // Update book_status to "Available" in the books table
            // await bookService.updateBookStatus(book_id, 'Available');

            // Update return_date in books_borrowed table to current date
            const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date in MySQL format
            await borrowerService.updateBorrowerBook(userId, book_id, { active: false, return_date: currentDate });

            await bookService.updateBookStatus(book_id, 'Available');

            res.locals.message = "Book returned successfully";
            return res.redirect("/user/profile");
        } catch (err) {
            console.error('Error returning book:', err);
            next(err); // Pass the error to the next error-handling middleware
        }
    }


};
