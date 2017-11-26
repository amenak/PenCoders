const express = require('express');
const router = express.Router();

router.use('/', require('./home'));
router.use('/', require('./book'));
router.use('/', require('./draft'));

module.exports = router;
