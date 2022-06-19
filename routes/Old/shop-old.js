const path = require('path');

const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  // How to send HTTP files instead of raw HTML code.
  // __dirname is a global variable made available by nodejs. This is the absolute
  // path to the current file's working directory; NOT the project's directory.
  console.log(__dirname);

  console.log(adminData.products);

  // This way of constructing paths is preferrable over hard coding or using slashes.
  // That is because this will make sure that the path is correct on any OS, not
  // just the one that the app was developed in.
  // The 2nd argument is to go up one directory.
  // Note that I purposefully did NOT use my own path.js so as to keep these
  // old comments for future reference.
  res.sendFile(path.join(__dirname, "../", 'views', 'shop.html'));
});

module.exports = router;