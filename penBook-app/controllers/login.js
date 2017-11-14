const express = require('express');
const passport = require('../middlewares/authentication');

const router = express.Router();
router.get('/', 
  passport.redirectIfLoggedIn('/'),
  (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
   passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
    })(req, res);
});

module.exports = router;