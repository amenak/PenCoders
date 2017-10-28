const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');

const router = express.Router();

router.get('/home', 
  passport.redirectIfNotLoggedIn('/sign-up'),
  (req, res) => {
  res.render('home');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up',
  passport.redirectIfLoggedIn('/profile'), 
  (req, res) => {
  models.Users.create({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
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
})

router.post('/login', (req, res) => {
   passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/login',
    })(req, res);
});


module.exports = router;
