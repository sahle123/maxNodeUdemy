const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const errorRoutes = require('./routes/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');

const logger = require('./utils/logger');

const PORT = 3000;

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

//
// DEFAULT MIDDLEWARE (i.e. runs on every request).
app.use(express.urlencoded({ extended: true }));
// Allows the serving of static files in a certain directory. This is only read 
// access. Typically, the 'public' folder is where all the content is stored.
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(rootDir, "public")));

//
// TEMPORARY: automatic user login
app.use((req, res, next) => {
  User
    .findById('62b3764869cb41b2490ae626')
    .then(user => {
      req.user = user;
      console.log(req);
      next();
    })
    .catch(err => { throw err; });
});

//
// ROUTING MIDDLEWARE
app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use('/', errorRoutes);



// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
logger.log('Starting Node.js server...');

mongoConnect(() => {
  app.listen(PORT, () => {
    logger.log(`Listening on port ${PORT}`);
  });
});

