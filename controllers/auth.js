const User = require('../models/user');
const logger = require('../utils/logger');


exports.getLogin = (req, res, next) => {
    //console.log(req.get('Cookie'));
    res.render('auth/login', {
        //path: '/login',
        isAuthenticated: req.session.isLoggedIn,
        pageTitle: 'Login'
    });
};

// DEV-NOTE: Will be adding authentication later.
// For now, it justs works no matter what you provide.
exports.postLogin = (req, res, next) => {
    
    // TEMPORARY: automatic user login.
    User.findById('645ce56e5e18e5e52347b3c4')    
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            //next();
            res.redirect('/shop');
        })
        .catch(err => logger.logError(err));

    // Setting cookie.
    //res.setHeader('Set-Cookie', 'loggedIn=true');
    //res.redirect('/shop');
}