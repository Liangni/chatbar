module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`);
    } else {
      req.flash('error_messages', `${err.name}`);
    }
    const url = req.headers.referer ? 'back' : '/groupChats';
    res.redirect(url);
    next(err);
  },
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      });
    } else {
      res.json({
        status: 'error',
        message: `${err}`
      });
    }
    // 不加next(err)，抓到錯誤後停在這，不往後傳
  }
};
