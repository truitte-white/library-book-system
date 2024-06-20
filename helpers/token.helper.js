const jwt = require('jsonwebtoken');

module.exports = {
    sign: async (body, next) => {
        return await jwt.sign(body, process.env.TOKEN_SECRET, { expiresIn: "1h" });
    },
    decode: async (token, next) => {
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            return decoded;
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new Error('Token expired');
            }
            throw err;
        }
    },
};
