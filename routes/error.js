const express = require('express');

const errorController = require('../controllers/error');

const router = express.Router();

// 'use' allows us to add a new middleware function.
// The 'next' function is the next function to be invoked in the middleware pipeline within express.
// Note that each next() function is called in the order the code is written.
// Note that 'use' applies to all HTTP verbs.
// Note that middleware order matters greatly. Anything below any middleware that sends
// back a response will never run or cause an error.
router.use('/', errorController.get404);

module.exports = router;