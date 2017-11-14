const express = require('express');
const passport = require('../middlewares/authentication');

const router = express.Router();

router.get('/', 
  passport.redirectIfNotLoggedIn('/login'),
  (req, res) => {
  res.render('profile', {user:req.user});
});

module.exports = router;
