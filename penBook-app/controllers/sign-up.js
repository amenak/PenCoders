const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');

const router = express.Router();

router.get('/', passport.redirectIfLoggedIn('/profile'),
 (req, res) => {
  res.render('sign-up');
});

router.post('/',
  passport.redirectIfLoggedIn('/profile'), 
  (req, res) => {
  models.Users.create({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    userName : req.body.userName,
    email: req.body.email,
    password_hash: req.body.password
  })
    .then((user) => {
      req.login(user, () => {
        res.redirect('/');
      })
    })
});

module.exports = router;