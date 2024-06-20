const connection = require("../server");
const { dbHelper } = require("../helpers");

module.exports = {
    findUserByEmail: async (email, next) => {
        try {
            const tableName = 'users';
            const filter = { email }; // Create filter object with email
            const userEmail = await dbHelper.findOne(connection, tableName, filter);
            return userEmail;
        } catch (err) {
            console.error('Error getting users email: ' + err.stack);
            throw err;
        }
    },
    findUserById: async (id, next) => {
        try {
            const tableName = 'users';
            const filter = { email }; 
            const user = await dbHelper.findOne(connection, tableName, filter);
            return user;
        } catch (err) {
            console.error('Error finding user by email:' + err.stack);
            throw err;
        }
    },
    createUser: async (userData) => {
        try {
            const { firstname, lastname, email, password, token, join_date } = userData;
            const tableName = 'users';
            const body = { firstname, lastname, email, password, token, join_date };

            // Validate join_date format
            if (!isValidDate(join_date)) {
                throw new Error('Invalid date format for join_date. Please use date format (YYYY-MM-DD)');
            }

            // Insert the user into the database
            const insertId = await dbHelper.create(connection, tableName, body);

            console.log('User inserted into database with ID: ' + insertId);

            return insertId;
        } catch (err) {
            console.error('Error inserting user into database from service: ' + err.stack);
            throw err;
        }
        // Function to validate date format (YYYY-MM-DD)
        function isValidDate(dateString) {
            const regexDate = /^\d{4}-\d{2}-\d{2}$/;
            return regexDate.test(dateString);
        }
    },
    updateUser: async (updatedBody, userId, next) => {
        try {
            const query = `
                UPDATE users
                SET firstname = ?, lastname = ?, email = ?, password = ?, token = ?, join_date = ?
                WHERE user_id = ?
            `;
            const values = [
                updatedBody.firstname || null,
                updatedBody.lastname,
                updatedBody.email,
                updatedBody.password,
                updatedBody.token,
                updatedBody.join_date,
                userId  // Pass userId here
            ];

            const result = await new Promise((resolve, reject) => {
                connection.query(query, values, (err, res) => {
                    if (err) reject(err);
                    else resolve(res.affectedRows); // Return the number of affected rows
                });
            });

            console.log(`User with ID ${userId} updated successfully.`);
            return result;
        } catch (err) {
            console.error(`Error updating user with ID ${userId}: ${err.stack}`);
            throw err;
        }
    },
    
}