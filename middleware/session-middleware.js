const session = require('cookie-session');

const SESSION_SECRET = 'secret';

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
});

module.exports = sessionMiddleware;
