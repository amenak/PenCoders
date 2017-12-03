const express = require('express');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const models = require('../models');
const getSlug = require('speakingurl');
const router = express.Router();

router.get('/', 
	passport.redirectIfNotLoggedIn('/login'),
	(req, res) => {
		models.Users.findOne({
			where: {
				username: req.user.username,
			},
			include: [{
				model:models.Books,
			},
			{
				model: models.DraftChapters,	
			}],
		}).then((user) => {
			(user ? res.render('publish', {user, allBooks: user.Books, allDrafts: user.DraftChapters}): res.redirect('/drafts'));
		})
});

router.post('/', 
	passport.redirectIfNotLoggedIn('/login'), 
	(req, res) => {
		models.DraftChapters.findOne({
			where: {
				id: req.body.draft,
			},
			include: [{
				model: models.Users,
				where: {
					username: req.user.username,
				},
			}],
		}).then((draft) => {
			models.Chapters.create({
				slug: getSlug(draft.title),
				title: draft.title,
				text: draft.text,
				BookId: req.body.book,
			}).then((chapter) => {
				draft.destroy();
				res.redirect('/books');
			})
		}).catch(()=>{
				res.redirect('/publish');
			});
});




module.exports = router;