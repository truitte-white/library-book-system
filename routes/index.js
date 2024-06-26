var express = require('express');
var router = express.Router();
const bookRoute = require("./add-book");
const userRoute = require("./user.route");

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index', { title: 'RF-SMART Library Book System'});
  //I want to add book comments on this page
});

router.use('/books', bookRoute);
router.use('/user', userRoute); 

module.exports = router;