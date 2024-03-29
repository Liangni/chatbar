/* eslint-disable consistent-return */
const { ensureAuthenticated } = require('../helpers/auth-helpers');

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (ensureAuthenticated(req)) {
    return next();
  }
  res.redirect('/pages/login');
};

module.exports = {
  authenticated
};
