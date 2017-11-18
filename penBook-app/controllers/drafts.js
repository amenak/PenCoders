router.get('/', (req, res) => {
  models.DraftChapters.findAll({
    include: [{model: models.User}]
  }).then((allPosts) => {
    res.render('posts', {allPosts});
  })
});

router.get('/new', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  res.render('posts/new');
});

router.post('/', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  req.user.createPost({
    slug: getSlug(req.body.title.toLowerCase()),
    title: req.body.title.toLowerCase(),
    body: req.body.body,
    catagory: req.body.catagory,
    genre: req.body.genre,
    language: req.body.language,
  }).then((post) => {
    res.redirect(`/posts/${req.user.username}/${post.slug}`);
  }).catch(() => {
    res.render('posts/new');
  });
});

router.get('/:username/:slug', (req, res) => {
  models.DraftChapters.findOne({
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

router.get('/:username/:slug/edit', passport.redirectIfNotLoggedIn('/login'), (req, res) => {
  models.DraftChapters.findOne({
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

router.put('/:username/:slug', passport.redirectIfNotLoggedIn('/login'), redirect.ifNotAuthorized('/posts'), (req, res) => {
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

router.delete('/:username/:slug', passport.redirectIfNotLoggedIn('/login'), redirect.ifNotAuthorized('/posts'), (req, res) => {
  models.DraftChapters.destroy({
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
