const { tokenHelper } = require("../helpers");

module.exports = {
    auth: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                throw new Error('Token not found');
            }

            const decoded = await tokenHelper.decode(token, next);
            if (!decoded.userId) {
                throw new Error('Invalid token: userId not found');
            }

            req.userId = decoded.userId;
            next();
        } catch (err) {
            console.error('Error in authentication middleware:', err.message);
            res.locals.message = "Please login to continue.";
            return res.redirect("/user/login");
        }
    }
};