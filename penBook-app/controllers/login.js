const express = require('express');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');

const router = express.Router();
router.get('/', 
	passport.redirectIfLoggedIn('/'), 
	(req, res) => {
  		res.render('login', { error: req.flash('error')});
});

router.post('/', (req, res) => {
   passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
      successFlash: true,
    })(req, res);
});

module.exports = router;