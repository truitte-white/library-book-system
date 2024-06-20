//website to help build from https://www.codewithfaraz.com/content/213/build-a-library-management-system-using-html-css-and-javascript-source-code --this is a good one
//https://code-boxx.com/javascript-library-management-system/ -- no databases
//https://www.geeksforgeeks.org/how-to-build-library-management-system-using-node-js/
//https://www.youtube.com/watch?v=FdC4Mjljd3k
//
//use this for database https://github.com/developermr/librarymanagmentsysteminphp/blob/main/library_managment.sql
//https://www.youtube.com/watch?v=aE5Ksj3fris
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'libraryadmin',
    password: 'Lmsdata123!',
    database: 'library'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Define your routes and other server logic here

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = connection;