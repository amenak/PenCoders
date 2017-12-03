const express = require('express');
const router = express.Router();

router.use('/', require('./home'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/profile', require('./profile'));
router.use('/sign-up', require('./sign-up'));
router.use('/drafts', require('./drafts.js'));
router.use('/books', require('./books.js'));
router.use('/publish', require('./publish.js'));


module.exports = router;
