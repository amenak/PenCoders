const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const getSlug = require('speakingurl');

const router = express.Router();

//book routes
router.get('/books', (req, res) => {
  models.Book.findAll({
    include: [{model: models.User}]
  }).then((allBooks) => {
    res.render('books', {allBooks});
  })
});

router.get('/books/new', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  res.render('books/new');
});

router.post('/books', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  req.user.createBook({
    slug: getSlug(req.body.title.toLowerCase()),
    title: req.body.title.toLowerCase(),
    description: req.body.description.toLowerCase(),
    catagory: req.body.catagory,
    genre: req.body.genre,
    language: req.body.language,
  }).then((book) => {
    res.redirect(`/books/${req.user.username}/${book.slug}`);
  }).catch(() => {
    res.render('books/new');
  });
});

router.get('/books/:username/:slug', (req, res) => {
  models.Book.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.User,
      where: {
        username: req.params.username,
      },
    }],
  }).then((book) => {
    (book ? res.render('books/single', { book, user: book.user }) : res.redirect('/books'));
  });
});

router.get('/books/:username/:slug/edit', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  models.Book.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.User,
      where: {
        username: req.params.username,
      },
    }],
  }).then((book) =>
    (book ? res.render('books/edit', { book }) : res.redirect('/books'))
  );
});

router.put('/books/:username/:slug', passport.redirectIfNotLoggedIn('/login'), redirect.ifNotAuthorized('/books'), (req, res) => {
  models.Book.update({
    title: req.body.title.toLowerCase(),
    slug: getSlug(req.body.title.toLowerCase()),
    description: req.body.description,
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
    res.redirect(`/books/${req.user.username}/${post.slug}`);
  }); 
});

router.delete('/books/:username/:slug', passport.redirectIfNotLoggedIn('/login'), redirect.ifNotAuthorized('/books'), (req, res) => {
  models.Book.destroy({
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
    res.redirect('/books');
  });
});

module.exports = router;
