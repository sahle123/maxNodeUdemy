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
    // Setting cookie.
    req.session.isLoggedIn = true;
    //res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/shop');
}