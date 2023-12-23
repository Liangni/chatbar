const requestLogger = (req, res, next) => {
    const start = Date.now()
    next()
    const delta = Date.now() - start
    console.info(`${req.method} ${req.originalUrl} took ${delta}ms`)
}

module.exports = requestLogger
