const path = require('path');

//
// Constants
const PORT = 3000;
const MONGODB_URI = require('./utils/database').MONGODB_URI;

const express = require('express');
const session = require('express-session'); // For session management.
const mongooseConnect = require('./utils/database').mongooseConnect;
const MongoDBStore = require('connect-mongodb-session')(session); // For light-weight session storage in MongoDB.
const csrf = require('csurf'); // **** DEV-NOTE: csurf is deprecated and a different package should be used for CSRF protection. ****
const connectFlash = require('connect-flash'); // Handy package for error messages.

const app = express();
const seshStorage = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'UserSessions'
});
const csrfProtection = csrf({ }); // The default settings work fine for our case.

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
// N.B. cookies are client-side. Sessions are server-side.
app.use(session({
  secret: 'always a beginner', // for signing the hash that is secretly stored in the cookie.
  resave: false,
  saveUninitialized: false,
  store: seshStorage,
  cookie: { /* Can add cookie configurations here... */ }
}));

// It's important to call the CSRF protection after the session since we need the session 
// to do our checking.
app.use(csrfProtection);

// Add connect-flash functionality to our app.
app.use(connectFlash()); 

// For getting session data and conforming it into a mongoose model
// that lets us use mongoose methods.
app.use((req, res, next) => {

  // Non-logged in user.
  if (!req.session.user) {
    return next();
  }

  // Logged in user.
  User.findById(req.session.user._id)
    .then(user => {
        req.user = user; // This will give us the mongoose model that lets us use mongoose methods.
        next();
    })
    .catch(err => logger.logError(err));
});

// Configuring all views to have these local variables available.
app.use((req, res, next) => {
  // The 'locals' field is specific to express.js.
  // Read up more on this later...
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
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
  app.listen(PORT, () => {
    logger.log(`Listening on port ${PORT}`);
  });
});

