const express = require('express');
const passport = require('../middlewares/authentication');
const redirect = require('../middlewares/redirect');
const models = require('../models');
const getSlug = require('speakingurl');
const router = express.Router();

router.get('/',
	passport.redirectIfNotLoggedIn('/login'),
	(req, res) => {
		models.Books.findAll({
			include:[{model:models.Users}],
      order: [['updatedAt', 'DESC']],
		}).then((allBooks) => {
			res.render('books', {allBooks});
		});
	});

router.get('/new',
	passport.redirectIfNotLoggedIn('/login'),
	(req, res) => { 
		res.render('books/new');
	});

router.post('/',
	passport.redirectIfNotLoggedIn('/login'),
	(req, res) => {
		req.user.createBook({
			slug: getSlug(req.body.title.toLowerCase()),
			title: req.body.title.toLowerCase(),
			genre: req.body.genre,
      description: req.body.description,
      catagory: req.body.catagory,
      language: req.body.language,
		}).then((book)=>{
			res.redirect(`/books/${req.user.username}/${book.slug}`);
		}).catch(() => {
			res.render('books/new');
		});
  });
  
router.post('/comments',
  passport.redirectIfNotLoggedIn('/login'),
  (req, res) => {
    models.Chapters.findOne({
      where: {
        id: req.body.chapter,
      },
      include: [{
				model: models.Users,
				where: {
					username: req.user.username,
				},
			}],
    }).then((chapter) => {
      models.Comments.create({
        slug: getSlug(chapter.title),
        bookSlug: getSlug(book.title),
        title: req.body.title,
        ChapterId: chapter.id,
        text: req.body.text,
        user: req.user.username,
      }).then((comment) => {
        res.redirect(`/books/${req.user.username}/${comment.bookSlug}/${comment.slug}`);
      })
    }).catch(() => {
        res.render('books/new');
    });
  });
   

router.get('/:username/:slug', 
  passport.redirectIfNotLoggedIn('/login'), 
  (req, res) => {
    models.Books.findOne({
      where: {
        slug: req.params.slug,
      },
      include: [{
        model: models.Users,
        where: {
          username: req.params.username,
        },
    },
    	{
    	model: models.Chapters,
      }],
    }).then((book) => {
      let isAuthor = false;
      if(req.user.username === book.User.username) isAuthor = true;
    	(book ? res.render('books/single', { book, user: book.User, chapters: book.Chapters, isAuthor: isAuthor }) : res.redirect('/books'));
    });
});

router.get('/:username/:slug/edit', 
  passport.redirectIfNotLoggedIn('/login'), 
  redirect.ifNotAuthorized('/'), 
  (req, res) => {
    models.Books.findOne({
      where: {
        slug: req.params.slug,
      },
      include: [{
        model: models.Users,
        where: {
          username: req.params.username,
        },
      }],
    }).then((book) =>
      (book ? res.render('books/edit', { book }) : res.redirect('/books'))
    );
});

router.put('/:username/:slug', 
  passport.redirectIfNotLoggedIn('/login'), 
  redirect.ifNotAuthorized('/'), 
  (req, res) => {
    models.Books.update({
      title: req.body.title.toLowerCase(),
      slug: getSlug(req.body.title.toLowerCase()),
      description: req.body.description,
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
      const book = rows[0];
      res.redirect(`/books/${req.user.username}/${book.slug}`);
    }); 
});



router.get('/:username/:slug/:slugChapters', 
	passport.redirectIfNotLoggedIn('/login'),
	(req, res) => {
		models.Chapters.findOne({
			where: {
				slug: req.params.slugChapters,
			},
			include: [{
				model: models.Books,
				where: {
					slug: req.params.slug,
				},
				include: {
					model: models.Users,
					where: {
						username: req.params.username,
					},
				},
      },
      {
        model: models.Comments,
      }],
		}).then((chapter) => {
			(chapter ? res.render('books/chapters/single', { chapter, user: chapter.Book.User, book: chapter.Book, comments: chapter.Comments}) : res.redirect(`/books/${req.params.username}/${req.params.slug}`));
		})
});


router.delete('/:username/:slug', 
  passport.redirectIfNotLoggedIn('/login'), 
  redirect.ifNotAuthorized('/'), 
  (req, res) => {
    models.Books.destroy({
      where: {
        slug: req.params.slug,
      },
      include: [{
        model: models.Users,
        where: {
          username: req.params.username,
        },
      },
      {
      	model: models.Chapters,
      }],
    }).then(() => {
      res.redirect('/books');
    });
});
module.exports = router;