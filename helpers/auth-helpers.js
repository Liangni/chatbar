const getUser = req => {
  //  有成功登入的狀況下，Passport會回傳user，可以透過req.user 把user物件拿出來
  return req.user || null
}
const ensureAuthenticated = req => {
  //   Passport提供的函式，會根據request的登入狀態回傳 true 或 false
  return req.isAuthenticated(req)
}

module.exports = {
  getUser,
  ensureAuthenticated
}