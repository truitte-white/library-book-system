var express = require('express');
var router = express.Router();
const bookRoute = require("./add-book");
const userRoute = require("./user.route");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/books', bookRoute);
router.use('/user', userRoute); 

module.exports = router;