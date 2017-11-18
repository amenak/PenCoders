const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');

const router = express.Router();

router.get('/', passport.redirectIfLoggedIn('/profile'),
 (req, res) => {
  res.render('sign-up', { error: req.flash('error')});
});


router.post('/', passport.redirectIfLoggedIn('/profile'), (req, res) => {
  req.checkBody('firstName', 'firstName is required').notEmpty();
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('lastName', 'lastName is required').notEmpty();
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('email', 'email is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('sign-up', {errors: errors})
  }else{
    models.Users.create({
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password_hash: req.body.password
    })
      .then((user) => {
        req.login(user, () => {
          res.redirect('/');
        })
      }).catch(() => {
          res.render('sign-up');
      });
  }
});

module.exports = router;