const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const models = require('../models');
const router = express.Router();

router.post('/:username/books', 
	redirectIfNotLoggedIn('/login'),
	redirectiIfNotAuthorized('/books')),
	(req, res) => {
			models.DraftChapters.findOne({
				where: {
					id: req.draftChapter.id,
				},
				include: [{
					model: models.Users,
					where: {
						username: req.params.username,
							},
						}],	
				}).then( (draftChapter) => {
					models.Chapters.create({
						title: draftChapter.title,
						slug: draftChapter.slug,
						text: draftChapter.text,
						BookId: req.Book.id,
						})
					}).then((chapter) => { 
						draftChapter.destroy().then(res.redirect(`/publish/${req.user.username}/:book/${chapter.slug}`));
						}).catch(()=>{
							res.render('')
						});
				});
});

module.exports = router;