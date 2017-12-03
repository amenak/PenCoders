const express = require('express');
const models = require('../models');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const getSlug = require('speakingurl');

const router = express.Router();

router.get('/', passport.redirectIfNotLoggedIn('/login'),  
  (req, res) => {
    models.DraftChapters.findAll({
      where: {
        UserId: req.user.id,
      },
      include: [{
        model: models.Users,
        where: {
          username: req.user.username,
        },
      }],
      order: [['updatedAt', 'DESC']],
    }).then((allDraftChapters) => {
      res.render('drafts', {allDraftChapters});
    })
});

router.get('/new', 
  passport.redirectIfNotLoggedIn('/login'),  
  (req, res) => {
    res.render('drafts/new');
});

router.post('/', 
  passport.redirectIfNotLoggedIn('/login'), 
  (req, res) => {
    req.user.createDraftChapter({
      slug: getSlug(req.body.title.toLowerCase()),
      title: req.body.title.toLowerCase(),
      text: req.body.text,
      genre: req.body.genre,
    }).then((draft) => {
      res.redirect(`/drafts/${req.user.username}/${draft.slug}`);
    }).catch(() => {
      res.render('drafts/new');
    });
});

router.get('/:username/:slug', 
  passport.redirectIfNotLoggedIn('/login'), 
  redirect.ifNotAuthorized('/'),
  (req, res) => {
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
      (draft ? res.render('drafts/single', { draft, user: draft.User }) : res.redirect('/drafts'));
    });
});

router.get('/:username/:slug/edit', 
  passport.redirectIfNotLoggedIn('/login'), 
  redirect.ifNotAuthorized('/'), 
  (req, res) => {
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

router.put('/:username/:slug', 
  passport.redirectIfNotLoggedIn('/login'), 
  redirect.ifNotAuthorized('/'), 
  (req, res) => {
    models.DraftChapters.update({
      title: req.body.title.toLowerCase(),
      slug: getSlug(req.body.title.toLowerCase()),
      text: req.body.text,
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

router.delete('/:username/:slug', 
  passport.redirectIfNotLoggedIn('/login'), 
  redirect.ifNotAuthorized('/'), 
  (req, res) => {
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