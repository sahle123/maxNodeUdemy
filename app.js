const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const errorRoutes = require('./routes/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongooseConnect = require('./utils/database').mongooseConnect;
const User = require('./models/user');

const logger = require('./utils/logger');

const PORT = 3000;
const DUMMY_USER = '62b3764869cb41b2490ae626'; // DEV-NOTE: For testing...

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
// Without this, the app cannot talk to Mongo. This is due to the
// design that Max chose.
app.use((req, res, next) => {
  User
    .findById(DUMMY_USER)
    .then(user => {
      req.user = new User(
        user._id,
        user.username,
        user.email,
        user.cart);
      logger.plog(`User ${DUMMY_USER} has logged in successfully!`);
      //console.log(req.user);
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

mongooseConnect(() => {

  // Make a default user if none exist.
  User
    .findOne()
    .then(user => {
      if(!user) {
        const user = new User({
          name: "Sal",
          email: "dummy@email.com",
          cart: {
            items: []
          }
        });
      }
    });

  app.listen(PORT, () => {
    logger.log(`Listening on port ${PORT}`);
  });
});

