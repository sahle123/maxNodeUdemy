// All error controllers are stored here.
const B = require('../utils/basic');

exports.get400 = (req, res, next) => {
  let msg = "Unknown";
  if (!B.isEmpty(req.params.errorMsg)) {
    msg = req.params.errorMsg;
  }

  res.status(400)
    .render('errors/400', { 
      pageTitle: 'Bad Request',
      isAuthenticated: req.session.isLoggedIn,
      errorMsg: msg
    });
}

exports.get404 = (req, res, next) => {
  res.status(404)
    .render('errors/404', { 
      isAuthenticated: req.session.isLoggedIn,
      pageTitle: 'Page Not Found'
    });
};

exports.get501 = (req, res, next) => {
  res.status(501)
    .render('errors/501', {
      isAuthenticated: req.session.isLoggedIn,
      pageTitle: 'Not Implemented' 
    });
};