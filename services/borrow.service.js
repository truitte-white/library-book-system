const connection = require("../server");
const { dbHelper } = require("../helpers");

module.exports = {
    borrowBook: async (body, next) => {
        try {
            console.log(body);
            const tableName = 'booksborrowed';
            const borrower = await dbHelper.create(connection, tableName, body, next);
    
            // Update book status in the books table
            await module.exports.updateBookStatus(body.BookId, 'Checked Out');
    
            return borrower;
        } catch (err) {
            console.error('Error creating borrower:', err);
            throw err;
        }
    },
    updateBookStatus: async (BookId, status) => {
        const sql = `UPDATE books SET BookStatus = ? WHERE BookId = ?`;
        const values = [status, BookId];
    
        try {
            const result = await new Promise((resolve, reject) => {
                connection.query(sql, values, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            return result;
        } catch (err) {
            throw err;
        }
    },
    findBorrowedBookById: async (userId, BookId, next) => {
        try {
            const tableName = 'booksborrowed';
            const filter = { userId: userId, BookId: BookId };
            const options = { populate: 'books' } 
            const borrowedBook = await dbHelper.findOne(connection, tableName, filter, options);
    
            console.log(`Borrowed book found:`, borrowedBook); // Log borrowedBook for debugging
    
            return borrowedBook;
        } catch (err) {
            console.error('Error finding borrowed book:', err);
            throw err;
        }
    },
    findAllBorrowedBooks: async (userId, next) => {
        try {
            const tableName = 'booksborrowed';
            const filter = { userId: userId };
            const options = { populate: 'books' }; // Assuming 'books' is the correct related table name
    
            const borrowedBooks = await dbHelper.findAll(connection, tableName, filter, options);
    
            console.log(`List of borrowed book(s) found for user:`, borrowedBooks);
            return borrowedBooks;
        } catch (err) {
            console.error('Error finding borrowed books by user:', err);
            throw err;
        }
    },
    updateBorrowerBook: async (userId, BookId, updateFields) => {
        const tableName = 'booksborrowed';
        const filter = { userId: userId, BookId: BookId };

        try {
            const result = await dbHelper.update(connection, tableName, updateFields, filter);
            return result;
        } catch (err) {
            console.error('Error updating borrower book:', err);
            throw err;
        }
    },
 };
