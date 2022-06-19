const path = require('path');

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const errorRoutes = require('./routes/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

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
// ROUTING MIDDLEWARE
app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use('/errors', errorRoutes);


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log("[ ] Starting nodejs server...");
  console.log(`[ ] Listening on port ${PORT}`);
});