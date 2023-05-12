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
    User.findById('62b3764869cb41b2490ae626')    
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // Not always needed, but in scenarios where latency can affect the result, this is a good idea to call.
            // i.e. res.redirect() will run regardless if the session data was finished writing to MongoDB or not.
            req.session.save(((err) => {
                if(err) {
                    logger.logError(err);
                }
                res.redirect('/shop');
            }));

            //res.redirect('/shop');
        })
        .catch(err => logger.logError(err));

    // Setting cookie.
    //res.setHeader('Set-Cookie', 'loggedIn=true');
    //res.redirect('/shop');
}

exports.postLogout = (req, res, next) => {
    // This 'destroy' method is provided by express's session library.
    req.session.destroy(err => {
        if(err) {
            logger.logError(err);
        }            
        res.redirect('/shop');
    });
}