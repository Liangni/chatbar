const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const userController = require('../../controllers/userContorller')
const { authenticated } = require('../../middleware/auth')


// 註冊登入登出
router.get('/login', userController.loginPage)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.post('/login', passport.authenticate('local', 
  {
    // 以下兩行前後分離可拿掉
    failureRedirect: '/users/login',
    failureFlash: true, // 失敗時傳送flash message
    // 如用JWT驗證(不用cookie-based驗證)，不需要Passport建立session，要設定session: false
  }
  ),
  userController.logIn
)
router.get('/logout', userController.logOut)

// 使用者訊息
router.get('/loginUser/messages', userController.getUserMessages)
router.get('/loginUser/groupChats/groupMessages', authenticated, userController.getUserGroupMessages)

// 全站使用者
router.get('/', authenticated, userController.getUsers)

module.exports = router