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
      errorMsg: msg
    });
}

exports.get404 = (req, res, next) => {
  res.status(404)
    .render('errors/404', { 
      pageTitle: 'Page Not Found'
    });
};

exports.get501 = (req, res, next) => {
  res.status(501)
    .render('errors/501', {
      pageTitle: 'Not Implemented' 
    });
};