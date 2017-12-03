const express = require('express');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');

const router = express.Router();


router.get('/',
    (req, res) => {
    res.render('home', {user: req.user});
  });


module.exports = router;
