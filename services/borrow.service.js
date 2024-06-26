const connection = require("../server");
const { dbHelper } = require("../helpers");

module.exports = {
    borrowBook: async (body, next) => {
        try {
            console.log(body);
            const tableName = 'books_borrowed';
            const borrower = await dbHelper.create(connection, tableName, body, next);
    
            // Update book status in the books table
            await module.exports.updateBookStatus(body.book_id, 'Checked Out');
    
            return borrower;
        } catch (err) {
            console.error('Error creating borrower:', err);
            throw err;
        }
    },
    updateBookStatus: async (book_id, status) => {
        const sql = `UPDATE books SET book_status = ? WHERE book_id = ?`;
        const values = [status, book_id];
    
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
    // borrowBook: async (body, next) => {
    //     try {
    //         console.log(body);
    //         const tableName = 'books_borrowed';
    //         const borrower = await dbHelper.create(connection, tableName, body, next);
    //         return borrower;
    //     } catch (err) {
    //         console.error('Error creating borrower:', err);
    //         throw err;
    //     }
    // },
    findBorrowedBookById: async (userId, book_id, next) => {
        try {
            const tableName = 'books_borrowed';
            const filter = { user_id: userId, book_id: book_id };
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
    updateBorrowerBook: async (userId, book_id, updateFields) => {
        const tableName = 'books_borrowed';
        const filter = { user_id: userId, book_id: book_id };

        try {
            const result = await dbHelper.update(connection, tableName, updateFields, filter);
            return result;
        } catch (err) {
            console.error('Error updating borrower book:', err);
            throw err;
        }
    },
 };
