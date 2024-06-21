const { tokenHelper } = require("../helpers");

module.exports = {
    loggedIn: async (req, res, next) => {
        try {
            const token = req.cookies['token'];
            if (!token) {
                res.locals.loggedIn = false;
                return next();
            }
    
            const decodedToken = await tokenHelper.decode(token, next);
            if (!decodedToken) {
                res.locals.loggedIn = false;
            } else {
                res.locals.loggedIn = true;
                res.locals.userId = decodedToken.userId;
                res.locals.role = decodedToken.role;
            }
    
            next();
        } catch (error) {
            console.error('Error in loggedIn middleware:', error);
            res.locals.loggedIn = false;
            next(error);
        }
    }
};