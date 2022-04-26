module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.send(`${err.name}: ${err.message}`)
    } else {
      res.send(`${err.name}`)
    }
    next(err)
  }
}