const connection = require("../server");

module.exports = {
    findOne: async (connection, tableName, filter = {}, options = {}) => {
        try {
            // Construct WHERE clause based on filter object
            const conditions = Object.keys(filter).map(key => `${key === 'userId' ? 'userId' : key} = ${connection.escape(filter[key])}`).join(' AND ');
            const whereClause = conditions ? ` WHERE ${conditions}` : '';
            const sql = `SELECT * FROM ${tableName}${whereClause}`;
    
            console.log('Generated SQL:', sql); // Log generated SQL for debugging
    
            const result = await new Promise((resolve, reject) => {
                connection.query(sql, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows[0]); // Resolve with the first row if found
                });
            });
    
            console.log('Result from database:', result); // Log result for debugging
            //populate method was added to populate different options?
            if (Object.keys(options)) {
                if (options?.populate) {
                    return await result;
                }
            }
            //populate method was added to populate different options?
            return await result;
        } catch (err) {
            throw err; // Throw any errors encountered during the query
        }
    },  

    // Modify findAll method to include JOIN query for population
    findAll: async (connection, tableName, filter = {}, options = {}) => {
        const joinTable = options.populate; // Assuming populate contains table name to join
        
        let sql = `SELECT * FROM ${tableName}`;
        if (joinTable) {
            sql += ` INNER JOIN ${joinTable} ON ${tableName}.BookId = ${joinTable}.BookId`; // Adjusted join condition
        }
    
        const conditions = Object.keys(filter).map(key => `${key === 'userId' ? 'userId' : key} = ${connection.escape(filter[key])}`).join(' AND ');
        const whereClause = conditions ? ` WHERE ${conditions}` : '';
        sql += whereClause;
    
        try {
            const result = await new Promise((resolve, reject) => {
                connection.query(sql, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            return result;
        } catch (err) {
            throw err;
        }
    },
    

    // findAll: async (connection, tableName, filter = {}, options = {}, next) => {
    //     const whereClause = Object.keys(filter).length > 0 ? ` WHERE ${connection.escape(filter)}` : '';
    //     const sql = `SELECT * FROM ${tableName}${whereClause}`;
    //     try {
    //         const result = await new Promise((resolve, reject) => {
    //             connection.query(sql, (err, rows) => {
    //                 if (err) reject(err);
    //                 else resolve(rows);
    //             });
    //         });
    //         //populate method was added to populate different options?
    //         if (Object.keys(options)) {
    //             if (options?.populate) {
    //                 console.log('populate')
    //             return await result;
    //             }
    //         }
    //         //populate method was added to populate different options?
    //         return await result;
    //     } catch (err) {
    //         throw err;
    //     }
    // },
    create: async (connection, tableName, body, next) => {
        const sql = `INSERT INTO ${tableName} SET ?`;
        try {
            const result = await new Promise((resolve, reject) => {
                connection.query(sql, body, (err, res) => {
                    if (err) reject(err);
                    else resolve(res.insertId); // Return the ID of the inserted row
                });
            });
            return await result;
        } catch (err) {
            throw err;
        }
    },
    delete: async (connection, tableName, filter, next) => {
        const sql = `DELETE FROM ${tableName} WHERE ${connection.escape(filter)}`;
        try {
            const result = await new Promise((resolve, reject) => {
                connection.query(sql, filter, (err, res) => {
                    if (err) reject(err);
                    else resolve(res.affectedRows); // Return the number of affected rows
                });
            });
            return await result;
        } catch (err) {
            throw err;
        }
    },
    update: async (connection, tableName, updatedBody, filter) => {
        const fieldsToUpdate = Object.keys(updatedBody).map(field => `${field} = ?`).join(', ');
    
        let sql;
        let values;
    
        if (filter.userId !== undefined && filter.BookId !== undefined) {
            sql = `UPDATE ${tableName} SET ${fieldsToUpdate} WHERE userId = ? AND BookId = ?`;
            values = [...Object.values(updatedBody), filter.userId, filter.BookId];
        } else {
            // Handle the case where userId is not present in the filter
            const conditions = Object.keys(filter).map(key => `${key} = ?`).join(' AND ');
            sql = `UPDATE ${tableName} SET ${fieldsToUpdate} WHERE ${conditions}`;
            values = [...Object.values(updatedBody), ...Object.values(filter)];
        }
    
        try {
            const result = await new Promise((resolve, reject) => {
                connection.query(sql, values, (err, res) => {
                    if (err) reject(err);
                    else resolve(res.affectedRows); // Return the number of affected rows
                });
            });
            return result;
        } catch (err) {
            throw err;
        }
    },
};