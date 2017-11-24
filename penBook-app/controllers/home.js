const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const getSlug = require('speakingurl');

const router = express.Router();

//login/sign-up routes
router.get('/', (req, res) => {
  res.render('home');
});

router.get('/profile', (req, res) => {
  res.render('profile', {user: req.user});
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up', { error: req.flash('error')});
});

router.post('/sign-up', passport.redirectIfLoggedIn('/profile'), (req, res) => {
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
    models.User.create({
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password_hash: req.body.password
    })
      .then((user) => {
        req.login(user, () => {
          res.redirect('/profile');
        })
      }).catch(() => {
          res.render('sign-up');
      });
  }
});

router.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/login');
});

router.post('/logout', (req,res) => {
  req.logout();
  res.redirect('/');
});

router.get('/login', passport.redirectIfLoggedIn('/profile'), (req, res) => {
  res.render('login', { error: req.flash('error')});
});

router.post('/login', (req, res) => {
   passport.authenticate('local', {
      successRedirect: '/posts',
      failureRedirect: '/login',
      failureFlash: true,
      successFlash: true,
    })(req, res);
});

module.exports = router;
