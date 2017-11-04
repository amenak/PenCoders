const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/profile', (req, res) => {
  res.render('profile');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up', passport.redirectIfLoggedIn('/profile'), (req, res) => {
  models.Users.create({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email: req.body.email,
    password_hash: req.body.password
  })
    .then((user) => {
      req.login(user, () => {
        res.redirect('/profile');
      })
    })
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
})

router.post('/login', (req, res) => {
   passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true,
      successFlash: true,
    })(req, res);
});


module.exports = router;
