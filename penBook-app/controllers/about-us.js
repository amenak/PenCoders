const express = require('express');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');

const router = express.Router();


router.get('/', (req, res) => {
  res.render('about-us');
});

module.exports = router;