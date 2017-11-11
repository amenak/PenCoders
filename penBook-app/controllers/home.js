const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');

const router = express.Router();

router.get('/',
  passport.redirectIfNotLoggedIn('/login'),
  (req, res) => {
    res.render('home', {user: req.user});
  });

router.get('/home', 
  passport.redirectIfNotLoggedIn('/sign-up'),
  (req, res) => {
  res.render('home', {user: req.user});
});

router.get('/sign-up', passport.redirectIfLoggedIn('/profile'),
 (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up',
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
        res.redirect('/home');
      })
    })
});

router.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/login');
});

router.get('/login', 
  passport.redirectIfLoggedIn('/home'),
  (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
   passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/login',
    })(req, res);
});

router.get('/profile', 
  passport.redirectIfNotLoggedIn('/login'),
  (req, res) => {
  res.render('profile', {user:req.user});
});


module.exports = router;
