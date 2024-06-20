const connection = require("../server");
const { dbHelper } = require("../helpers");

module.exports = {
    createFine: async (body, next) => {
        try {
            const tableName = 'fine';
            const fine = await dbHelper.create(connection, tableName, body, next);
            return fine;
        } catch (err) {
            console.error('Error creating returned: ' + err.stack);
            throw err;
        }
    },

};