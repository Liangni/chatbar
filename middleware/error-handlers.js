module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err.name}`)
    }
    const url = req.headers.referer ? 'back' : '/groupChats'
    res.redirect(url) 
    next(err)
  }
}