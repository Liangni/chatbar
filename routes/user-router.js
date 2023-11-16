const express = require('express');

const userRouter = express.Router();
const passport = require('../config/passport');
const userController = require('../controllers/user-contorller');

// 註冊登入登出
userRouter.post('/register', userController.register);
userRouter.post(
  '/login',
  passport.authenticate(
    'local',
    {
    // 以下兩行前後分離可拿掉
      failureRedirect: 'pages/users/login',
      failureFlash: true // 失敗時傳送flash message
    // 如用JWT驗證(不用cookie-based驗證)，不需要Passport建立session，要設定session: false
    }
  ),
  userController.logIn
);
userRouter.get('/logout', userController.logOut);

module.exports = userRouter;
