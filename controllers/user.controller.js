const { userService, borrowerService } = require("../services");
const bcrypt = require("bcrypt");
const { tokenHelper, dbHelper } = require("../helpers");
const { findAllBorrowedBooks } = require("../services/borrow.service");

module.exports = {
    getLoginForm: (req, res) => {
        res.render("form/login");
    },

    getSignupForm: (req, res) => {
        res.render("form/signup");
    },
    getProfile: async (req, res, next) => {
        const userId = req.userId;
        try {
            const allBorrowedBooks = await borrowerService.findAllBorrowedBooks(userId, next);
            console.log(allBorrowedBooks);
            res.render("pages/profile", { books: allBorrowedBooks });
        } catch (err) {
            console.error('Error in getProfile:', err);
            // Handle error appropriately
            next(err); // Assuming you're using Express, pass error to next middleware
        }
    },

    // getProfile: async (req, res, next) => {
    //     const userId = req.userId;
    //     const allBorrowedBooks = await borrowerService.findAllBorrowedBooks(userId, next);
    //     console.log(allBorrowedBooks)
    //     res.render("pages/profile", {books: allBorrowedBooks});
    // },

    login: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            // Find user by email
            const user = await userService.findUserByEmail(email, next);
            if (!user) {
                res.locals.message = "User does not exist with this email.";
                return res.redirect("/user/login");
            }

            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.Password);
            if (!passwordMatch) {
                res.locals.message = "Incorrect password.";
                return res.redirect("/user/login");
            }

            // Successful login
            const userId = user.UserId; // Assuming userid is the correct property name
            console.log(`User ${user.Email} logged in successfully.`);

            // Sign token
            const token = await tokenHelper.sign({ userId }, next);

            // Update user token in database
            user.token = token;
            await userService.updateUser(user, userId, next);

            // Set cookie
            res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 1 });

            // Redirect to profile page
            return res.redirect("/user/profile");
        } catch (err) {
            console.error('Error in login:', err);
            next(err);
        }
    },

    signup: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await userService.findUserByEmail(email, next);
            if (user) {
                res.locals.message = "User already exists.";
                return res.redirect("/user/signup");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            req.body.password = hashedPassword;

            const newUser = await userService.createUser(req.body);
            if (newUser) {
                res.locals.message = "Account created successfully. Please login to continue.";
                return res.redirect("/user/login");
            }
            res.redirect("/user/signup");

        } catch (err) {
            console.error('Error in signup:', err);
            next(err);
        }
    },
    logout: async (req, res, next) => {
        res.cookie("token", "");
        return res.redirect("/user/login");

    }
};
