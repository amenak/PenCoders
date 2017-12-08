const express = require('express');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');

const router = express.Router();


router.get('/',
	passport.redirectIfNotLoggedIn('/login'),
    (req, res) => {
    res.render('home', {user: req.user});
  });


module.exports = router;