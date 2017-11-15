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
  res.render('profile');
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

//posting routes
router.get('/posts', (req, res) => {
  models.Post.findAll({
    include: [{model: models.User}]
  }).then((allPosts) => {
    res.render('posts', {allPosts});
  })
});

router.get('/posts/new', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  res.render('posts/new');
});

router.post('/posts', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  req.user.createPost({
    slug: getSlug(req.body.title.toLowerCase()),
    title: req.body.title.toLowerCase(),
    body: req.body.body,
  }).then((post) => {
    res.redirect(`/posts/${req.user.username}/${post.slug}`);
  }).catch(() => {
    res.render('posts/new');
  });
});

router.get('/posts/:username/:slug', (req, res) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.User,
      where: {
        username: req.params.username,
      },
    }],
  }).then((post) => {
    (post ? res.render('posts/single', { post, user: post.user }) : res.redirect('/posts'));
  });
});

router.get('/posts/:username/:slug/edit', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  models.Post.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.User,
      where: {
        username: req.params.username,
      },
    }],
  }).then((post) =>
    (post ? res.render('posts/edit', { post }) : res.redirect('/posts'))
  );
});

router.put('/posts/:username/:slug', passport.redirectIfNotLoggedIn('/login'), redirect.ifNotAuthorized('/posts'), (req, res) => {
  models.Post.update({
    title: req.body.title.toLowerCase(),
    slug: getSlug(req.body.title.toLowerCase()),
    body: req.body.body,
  },
  {
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.User,
      where: {
        username: req.params.username,
      },
    }],
    returning: true,
  }).then(([numRows, rows]) => {
    const post = rows[0];
    res.redirect(`/posts/${req.user.username}/${post.slug}`);
  }); 
});

router.delete('/posts/:username/:slug', passport.redirectIfNotLoggedIn('/login'), redirect.ifNotAuthorized('/posts'), (req, res) => {
  models.Post.destroy({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.User,
      where: {
        username: req.params.username,
      },
    }],
  }).then(() => {
    res.redirect('/posts');
  });
});



module.exports = router;
