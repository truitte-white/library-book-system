const { bookService, commentService, borrowerService } = require("../services");

module.exports = {
    addCommentForm: (req, res, next) => {
        res.render('form/add-comment');
    },
    editCommentForm: (req, res, next) => {
        res.render('form/edit-comment');
    },
    addComment: async (req, res) => {
        console.log(req.body)
        try {
            const insertId = await commentService.create(req.body)
            console.log('Book inserted with ID: ' + insertId);
            return res.redirect("/books");
        } catch (err) {
            console.error('Error inserting book into database from controller: ' + err.stack);
            res.status(500).json({ error: 'Error inserting book into database from controller' });
        }
    },
    editComment: async (req, res) => {
        console.log(req.body)
        try {
            const insertId = await commentService.actuallyUpdate(req.body)
            console.log('Book inserted with ID: ' + insertId);
            return res.redirect("/books");
        } catch (err) {
            console.error('Error inserting book into database from controller: ' + err.stack);
            res.status(500).json({ error: 'Error inserting book into database from controller' });
        }
    }

};
