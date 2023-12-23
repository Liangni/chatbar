const { wrap, authenticate } = require('./middleware/sockets')
const sessionMiddleware = require('./middleware/session-middleware')
const passport = require('./config/passport')
const onConnection = require('./api/io-events/connection')
const socketEvents = require('./api/socket-events')

function init(io) {
    io.use(wrap(sessionMiddleware))
    io.use(wrap(passport.initialize()))
    io.use(wrap(passport.session()))
    io.use(authenticate)
}

function listen(io) {
    init(io)

    io.on('connection', onConnection(io, socketEvents))
}

module.exports = { listen }
