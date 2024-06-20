const connection = require("../server");
const { dbHelper } = require("../helpers");

module.exports = {
    returnBook: async (body, next) => {
        try {
            const tableName = 'books_returned';
            const returned = await dbHelper.create(connection, tableName, body, next);
            return returned;
        } catch (err) {
            console.error('Error creating returned: ' + err.stack);
            throw err;
        }
    },
    findReturnBookById: async (userId, book_id, next) => {
        try {
            const tableName = 'books_returned';
            const books = await dbHelper.findOne(connection, tableName, userId, book_id, next);
            return books;
        } catch (err) {
            console.error('Error returning book: ' + err.stack);
            throw err;
        }
    }
};