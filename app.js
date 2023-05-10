const path = require('path');

//
// Constants
const PORT = 3000;
const DUMMY_USER = '62b3764869cb41b2490ae626'; // DEV-NOTE: For testing...
const MONGODB_URI = require('./utils/database').MONGODB_URI;

const express = require('express');
const session = require('express-session'); // For session management.
const mongooseConnect = require('./utils/database').mongooseConnect;
const MongoDBStore = require('connect-mongodb-session')(session); // For light-weight session storage in MongoDB.

const app = express();
const seshStorage = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'UserSessions'
})

app.set('view engine', 'ejs');
app.set('views', './views');

const errorRoutes = require('./routes/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');
const logger = require('./utils/logger');


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

//
// DEFAULT MIDDLEWARE (i.e. runs on every request).
app.use(express.urlencoded({ extended: true }));
// Allows the serving of static files in a certain directory. This is only read 
// access. Typically, the 'public' folder is where all the content is stored.
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(rootDir, "public")));
// For session management middleware.
// Note: cookies are client-side. Sessions are server-side.
app.use(session({
  secret: 'always a beginner', // for signing the hash that is secretly stored in the cookie.
  resave: false,
  saveUninitialized: false,
  store: seshStorage,
  cookie: {
    // Can add cookie configurations here...
  }
}));

//
// TEMPORARY: automatic user login
// Without this, the app cannot talk to Mongo. This is due to the
// design that Max chose for now.
app.use((req, res, next) => {
  User
    .findById(DUMMY_USER)
    .then(resultantUser => {
      req.user = resultantUser;
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
app.use(authRoutes);
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

