// Packages
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/user');

// Utils
const logger = require('../utils/logger');
const basic = require('../utils/basic');


exports.getLogin = (req, res, next) => {    
    res.render('auth/login', {
        pageTitle: 'Login',
        errorMessage: basic.getFlashErrorMsg(req.flash('error'))
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        errorMessage: basic.getFlashErrorMsg(req.flash('error'))
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User
        .findOne({ email: email })
        .then(user => {

            // User exists
            if(user) {
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {

                        // Passwords are equal.
                        if(isMatch) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            // Not always needed, but in scenarios where latency can affect the result, this is a good idea to call.
                            // i.e. res.redirect() will run regardless if the session data was finished writing to MongoDB or not.
                            return req.session.save(((err) => {
                                if(err) { logger.logError(err); }
                                res.redirect('/shop');
                            }));
                        }
                        // Mismatched password
                        else {
                            req.flash('error', 'Invalid email or password');
                            loginError(res, "Email/password combo wrong or user doesn't exist.");
                        }
                    })
                    .catch(err => logger.logError(err));
            }
            // Otherwise, wrong username/password combo.
            else {
                req.flash('error', 'Invalid email or password');
                loginError(res, "Email/password combo wrong or user doesn't exist.");
            }
        })
        .catch(err => logger.logError(err));
};

exports.postLogout = (req, res, next) => {
    // This 'destroy' method is provided by express's session library.
    req.session.destroy(err => {
        if(err) {
            logger.logError(err);
        }            
        res.redirect('/shop');
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // Password validation.
    if(password !== confirmPassword) {
        req.flash('error', 'Passwords are mismatched. Please retype them again.');
        logger.logError('Passwords are mismatched!!!');
        logger.logError(password + " : " + confirmPassword);
        return res.redirect('/signup');
    }

    // Check if email already exists.
    User.findOne({ 
        email: email
    })
    .then(userDoc => { 
        // i.e. user already exists
        if(userDoc) {
            req.flash('error', 'Email already exists. Please choose another email address.');
            logger.logError(`This user (${email}) already exists!`);
            return res.redirect('/signup');
        }

        // Hash password async. 12 rounds of hashing.
        return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                // Create new user
                const newSignup = new User({
                    email: email,
                    password: hashedPassword,
                    username: "TEST USER",
                    cart: { items: [] }
                });
        
                return newSignup.save();
            })
            .then(result => {
                logger.plog("New user successfully created.");
                res.redirect('/login');
            })
            .catch(err => { logger.logError(err); });
    })
    .catch(err => { logger.logError(err); });
};

// DRY code for login errors
const loginError = (res, msg) => {
    logger.logError(msg);
    res.redirect('/login');
}