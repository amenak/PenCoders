const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const getSlug = require('speakingurl');

const router = express.Router();

//posting routes
router.get('/posts', (req, res) => {
  models.Book.findAll({
    include: [{model: models.User}]
  }).then((allPosts) => {
    res.render('posts', {allPosts});
  })
});

router.get('/posts/new', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  res.render('posts/new');
});

router.post('/posts', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  req.user.createBook({
    slug: getSlug(req.body.title.toLowerCase()),
    title: req.body.title.toLowerCase(),
    catagory: req.body.catagory,
    genre: req.body.genre,
    language: req.body.language,
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
