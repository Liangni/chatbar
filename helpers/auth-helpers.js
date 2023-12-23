//  成功登入的狀況下，Passport會回傳user，可以透過req.user 把user物件拿出來
const getUser = (req) => req.user || null

//   Passport提供的函式，會根據request的登入狀態回傳 true 或 false
const ensureAuthenticated = (req) => req.isAuthenticated(req)

module.exports = {
    getUser,
    ensureAuthenticated
}
