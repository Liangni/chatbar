const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

const authenticate = (socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
};

module.exports = { wrap, authenticate };
