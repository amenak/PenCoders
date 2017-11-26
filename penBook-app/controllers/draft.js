const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const getSlug = require('speakingurl');

const router = express.Router();


//draft routes
router.get('/draft', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  models.Draft.findAll({
    include: [{model: models.Book}]
  }).then((allDrafts) => {
    res.render('draft', {allDrafts});
  })
});

router.get('/draft/new', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  res.render('draft/new');
});
  
router.post('/draft', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  req.book.createDraft({
    slug: getSlug(req.body.title.toLowerCase()),
    title: req.body.title.toLowerCase(),
    body: req.body.body,
  }).then((draft) => {
    res.redirect(`/draft/${req.book.id}/${draft.slug}`);
  }).catch(() => {
    res.render('draft/new');
  });
});

router.get('/draft/:id/:slug', (req, res) => {
    models.Draft.findOne({
      where: {
        slug: req.params.slug,
      },
      include: [{
        model: models.Book,
      }],
    }).then((draft) => {
      (draft ? res.render('draft/single', { draft, book: draft.book }) : res.redirect('/books'));
    });
  });
module.exports = router;