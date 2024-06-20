const connection = require("../server");
const { dbHelper } = require("../helpers");

module.exports = {
    borrowBook: async (body, next) => {
        try {
            console.log(body);
            const tableName = 'books_borrowed';
            const borrower = await dbHelper.create(connection, tableName, body, next);
            return borrower;
        } catch (err) {
            console.error('Error creating borrower:', err);
            throw err;
        }
    },
    findBorrowedBookById: async (userId, book_id, next) => {
        try {
            const tableName = 'books_borrowed';
            const filter = { user_id: userId, book_id: book_id }; // Correctly specify column names
            const borrowedBook = await dbHelper.findOne(connection, tableName, filter);
    
            console.log(`Borrowed book found:`, borrowedBook); // Log borrowedBook for debugging
    
            return borrowedBook;
        } catch (err) {
            console.error('Error finding borrowed book:', err);
            throw err;
        }
    },
    findAllBorrowedBooks: async (userId, next) => {
        try {
            const tableName = 'books_borrowed';
            const filter = { user_id: userId };
            const options = { populate: 'books' }; // Assuming 'books' is the correct related table name
    
            const borrowedBooks = await dbHelper.findAll(connection, tableName, filter, options);
    
            console.log(`List of borrowed book(s) found for user:`, borrowedBooks);
            return borrowedBooks;
        } catch (err) {
            console.error('Error finding borrowed books by user:', err);
            throw err;
        }
    },
    
    // findAllBorrowedBooks: async (userId, next) => {
    //     try {
    //         const tableName = 'books_borrowed';
    //         const filter = { user_id: userId }; // Correctly specify column names
    //         const borrowedBooks = await dbHelper.findAll(connection, tableName, filter, {populate: "book_id"});
    
    //         console.log(`List of borrowed book(s) found for user:`, borrowedBooks); // Log borrowedBook for debugging
    
    //         return borrowedBooks;
    //     } catch (err) {
    //         console.error('Error finding borrowed books by user:', err);
    //         throw err;
    //     }
    // }
    
};
