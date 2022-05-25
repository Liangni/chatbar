const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Group_chat } = require('../models')


// 設定用帳號密碼做登入驗證
passport.use(new LocalStrategy(
  // customize user field，預設使用 username 和 password 作為驗證的欄位
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true // 如果需要在 verify callback 中取得 req
  },
  // customize verify callback
  // 因為上面有註明 passReqToCallback: true，所以第一個參數會是 req
  async (req, account, password, done) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) { 
        return done(
          null,
          false,
          // 前後分離則改成 { message: 'Incorrect username.' }
          req.flash('error_messages', '帳號或密碼輸入錯誤')
        )
      }
      if (!bcrypt.compareSync(password, user.password)) { 
        return done(
          null,
          false,
          // 前後分離則改成 { message: 'Incorrect password.' }
          req.flash('error_messages', '帳號或密碼輸入錯誤')
        )
      }
      return done(null, user)
    } catch(err) {
      return done(err)
    } 
  }
))

// 若採用JWT驗證，要加入下方程式碼
  // const passportJWT = require('passport-jwt')
  // const JWTStrategy = passportJWT.Strategy
  // const ExtractJWT = passportJWT.ExtractJwt
  // const jwtOptions = {
  //   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // 至authorization header取得token
  //   secretOrKey: process.env.JWT_SECRET // 檢查token的密鑰
  // }

  // passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  //   User.findByPk(jwtPayload.id, { include: { model: Interest, as: 'CurrentInterests' } })
  //     .then(user => cb(null, user))
  //     .catch(err => cb(err))
  // }))



// 設定序列化與反序列化，若採用JWT驗證則省略
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    let user = await User.findByPk(id, {
      include: [
        { model: Group_chat, as:'RegisteredGroups'},
        { model: User, as: 'FriendshipInvitationRecievers'},
        { model: User, as: 'FriendshipInvitationSenders' },
        { model: User, as: 'Friends' }
      ]
    })
    user = user.toJSON()
    return cb(null, user)
  } catch(err) {
    return cb(err)
  }
})





module.exports = passport