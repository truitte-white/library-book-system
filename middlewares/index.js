const authMiddleware = require("./auth.middleware");
const loggedInMiddleware = require("./loggedIn.middleware");


module.exports = {
    authMiddleware,
    loggedInMiddleware
}