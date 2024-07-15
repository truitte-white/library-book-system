const { bookService, commentService, borrowerService } = require("../services");

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

    editBookForm: async (req, res, next) => {
        try {
            const { bookId } = req.body;
            const userId = req.userId;

            console.log('UserId:', userId);
            console.log('BookId:', bookId);

            const book = await bookService.findBookById(bookId);
            if (!book) {
                res.locals.message = "Book ID does not exist";
                console.error('Book ID does not exist');
                return res.redirect("/books");
            }

            // Render the edit-book form with book details
            res.render('form/edit-book', { book });

        } catch (err) {
            console.error('Error:', err);
            next(err);
        }
    },

    addBook: async (req, res) => {
        console.log(req.body);
        try {
            const insertId = await bookService.addBook(req.body);
            console.log('Book inserted with ID: ' + insertId);
            return res.redirect("/books");
        } catch (err) {
            console.error('Error inserting book into database from controller: ' + err.stack);
            res.status(500).json({ error: 'Error inserting book into database from controller' });
        }
    },

    borrowBook: async (req, res, next) => {
        try {
            const { BookId } = req.params; // Accessing BookId from route parameters
            const userId = req.userId; // Assuming userId is retrieved from middleware or authentication

            console.log('UserId:', userId);
            console.log('BookId:', BookId);

            // Check if the book is already borrowed by the user
            const alreadyBorrowed = await borrowerService.findBorrowedBookById(userId, BookId);
            if (alreadyBorrowed && alreadyBorrowed.active) {
                res.locals.message = "User has already borrowed this book";
                console.error('User has already borrowed this book');
                return res.redirect("/books");
            }

            // Check if the book exists and is available
            const book = await bookService.findBookById(BookId);
            if (!book) {
                res.locals.message = "Book ID does not exist";
                console.error('Book ID does not exist');
                return res.redirect("/books");
            }
            if (book.BookStatus !== 'Available') {
                res.locals.message = `Book ${book.book_title} is not in stock`;
                console.error('Book is not in stock');
                return res.redirect("/books");
            }

            // Borrow the book (insert into booksborrowed table)
            await borrowerService.borrowBook({ userId: userId, BookId });

            // Update BookStatus to 'Checked Out' in the books table
            await bookService.updateBookStatus(BookId, 'Checked Out'); // Assuming bookService can update the book status

            // Success message
            res.locals.message = `Successfully borrowed book ${book.book_title}`;
            res.redirect("/books");
        } catch (err) {
            console.error('Error:', err);
            next(err); // Ensure error is passed to the next middleware/handler
        }
    },

    returnBook: async (req, res, next) => {
        const { BookId } = req.params;
        const userId = req.userId;
    
        try {
            // Check if the book is borrowed by the user and is active
            const borrowedBook = await borrowerService.findBorrowedBookById(userId, BookId);
            if (!borrowedBook || !borrowedBook.active) {
                res.locals.message = "Book is already returned or not borrowed by the user";
                return res.redirect("/user/profile");
            }
    
            console.log('Before updating book status');
            await bookService.updateBookStatus(BookId, 'Available'); // Update book status to 'Available' in the books table
            console.log('After updating book status');
    
            // Update return_date in booksborrowed table to current date
            const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current date in MySQL format
            console.log('Before updating borrower book');
            await borrowerService.updateBorrowerBook(userId, BookId, { active: false, return_date: currentDate });
            console.log('After updating borrower book');
    
            res.locals.message = "Book returned successfully";
            return res.redirect("/user/profile");
        } catch (err) {
            console.error('Error returning book:', err);
            next(err); // Pass the error to the next error-handling middleware
        }
    },

    editBook: async (req, res, next) => {
        try {
            const { BookId } = req.params;
            const { BookStatus } = req.body; // Access BookStatus from req.body

            console.log('UserId:', req.userId);
            console.log('BookId:', BookId);
            console.log('New Book Status:', BookStatus);

            // Update the book status using bookService or similar
            const updatedBook = await bookService.updateBookStatus(BookId, BookStatus);

            // Handle the updatedBook response as needed
            console.log('Updated Book:', updatedBook);

            // Redirect or render success message
            res.redirect('/books'); // Example redirect after update

        } catch (err) {
            console.error('Error updating book status:', err);
            next(err);
        }
    }
};
