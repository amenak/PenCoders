const express = require('express');
const router = express.Router();

router.use('/', require('./home'));
router.use('/', require('./post'));


module.exports = router;
