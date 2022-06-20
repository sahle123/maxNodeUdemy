// All error controllers are stored here.

exports.get404 = (req, res, next) => {
  res.status(404)
    .render('errors/404', { pageTitle: 'Page Not Found' });
};

exports.get501 = (req, res, next) => {
  res.status(501)
    .render('errors/501', { pageTitle: 'Not Implemented' });
};