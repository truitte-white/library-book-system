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
            const { BookName, AuthorName, Genre, PublishYear } = bookData;
            const tableName = 'books';
            const body = { BookName, AuthorName, Genre, PublishYear };

            // Insert the book into the database
            const insertId = await dbHelper.create(connection, tableName, body);

            console.log('Book inserted into database with ID: ' + insertId);

            return insertId;
        } catch (err) {
            console.error('Error inserting book into database from service: ' + err.stack);
            throw err;
        }
    },
    findBookById: async (BookId, next) => {
        try {
            const tableName = 'books';
            const filter = { BookId: BookId }; // Assuming 'id' is the primary key column name
            const book = await dbHelper.findOne(connection, tableName, filter);
            console.log(`Book found: ${book.BookName} for ID: ${BookId}`);
            return book;
        } catch (err) {
            console.error('Error getting book by ID:', err);
            throw err;
        }
    },
    updateBookStatus: async (BookId, BookStatus) => {
        try {
            const tableName = 'books';
            const filter = { BookId: BookId }; // Assuming 'BookId' is the primary key column name
            const updatedFields = { BookStatus: BookStatus };

            const numRowsAffected = await dbHelper.update(connection, tableName, updatedFields, filter);

            if (numRowsAffected > 0) {
                // Book updated successfully
                const updatedBook = await dbHelper.findOne(connection, tableName, filter);
                return updatedBook;
            } else {
                throw new Error(`Failed to update book with ID ${BookId}`);
            }
        } catch (err) {
            throw err;
        }
    },
};
