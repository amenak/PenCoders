const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const getSlug = require('speakingurl');

const router = express.Router();

router.get('/', (req, res) => {
  models.DraftChapters.findAll({
    include: [{model: models.Users}]
  }).then((allDraftChapters) => {
    res.render('drafts', {allDraftChapters});
  })
});

router.get('/new', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  res.render('drafts/new');
});

router.post('/', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  req.user.createDraftChapter({
    slug: getSlug(req.body.title.toLowerCase()),
    title: req.body.title.toLowerCase(),
    body: req.body.body,
    catagory: req.body.catagory,
    genre: req.body.genre,
    language: req.body.language,
  }).then((draft) => {
    res.redirect(`/drafts/${req.user.username}/${draft.slug}`);
  }).catch(() => {
    res.render('drafts/new');
  });
});

router.get('/:username/:slug', (req, res) => {
  models.DraftChapters.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.Users,
      where: {
        username: req.params.username,
      },
    }],
  }).then((draft) => {
    (draft ? res.render('drafts/single', { draft, user: draft.user }) : res.redirect('/drafts'));
  });
});

router.get('/:username/:slug/edit', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  models.DraftChapters.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.Users,
      where: {
        username: req.params.username,
      },
    }],
  }).then((draft) =>
    (draft ? res.render('drafts/edit', { draft }) : res.redirect('/drafts'))
  );
});

router.put('/:username/:slug', passport.redirectIfNotLoggedIn('/login'), redirect.ifNotAuthorized('/drafts'), (req, res) => {
  models.DraftChapters.update({
    title: req.body.title.toLowerCase(),
    slug: getSlug(req.body.title.toLowerCase()),
    body: req.body.body,
  },
  {
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.Users,
      where: {
        username: req.params.username,
      },
    }],
    returning: true,
  }).then(([numRows, rows]) => {
    const draft = rows[0];
    res.redirect(`/drafts/${req.user.username}/${draft.slug}`);
  }); 
});

router.delete('/:username/:slug', passport.redirectIfNotLoggedIn('/login'), redirect.ifNotAuthorized('/drafts'), (req, res) => {
  models.DraftChapters.destroy({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.Users,
      where: {
        username: req.params.username,
      },
    }],
  }).then(() => {
    res.redirect('/drafts');
  });
});

module.exports = router;