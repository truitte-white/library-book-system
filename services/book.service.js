const connection = require("../server");
const { dbHelper } = require("../helpers");

module.exports = {
    getAllBooks: async (next) => {
        try {
            const tableName = 'books';
            const books = await dbHelper.findAll(connection, tableName);
            return books;
        } catch (err) {
            console.error('Error getting all books: ' + err.stack);
            throw err;
        }
    },

    addBook: async (bookData) => {
        try {
            const { book_name, author_name, genre, publish_year } = bookData;
            const tableName = 'books';
            const body = { book_name, author_name, genre, publish_year };

            // Insert the book into the database
            const insertId = await dbHelper.create(connection, tableName, body);

            console.log('Book inserted into database with ID: ' + insertId);

            return insertId;
        } catch (err) {
            console.error('Error inserting book into database from service: ' + err.stack);
            throw err;
        }
    },
    findBookById: async (book_id, next) => {
        try {
            const tableName = 'books';
            const filter = { book_id: book_id }; // Assuming 'id' is the primary key column name
            const book = await dbHelper.findOne(connection, tableName, filter);
            console.log(`Book found: ${book.book_name} for ID: ${book_id}`);
            return book;
        } catch (err) {
            console.error('Error getting book by ID:', err);
            throw err;
        }
    },
    updateBookStatus: async (userId, book_id, newStatus) => {
        try {
            const tableName = 'books';
            const filter = { user_id: userId, book_id: book_id };
            const updatedFields = { book_status: 'Available' }; // Update book_status field

            const numRowsAffected = await dbHelper.update(connection, tableName, updatedFields, filter);

            if (numRowsAffected > 0) {
                // Book updated successfully
                const updatedBook = await dbHelper.findOne(connection, tableName, filter);
                return updatedBook;
            } else {
                throw new Error(`Failed to update book with ID ${book_id}`);
            }
        } catch (err) {
            throw err;
        }
    },
};
