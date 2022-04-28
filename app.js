if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const PORT = 3000
const SESSION_SECRET = 'secret'
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')
const routes = require('./routes')

// 設定樣板引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: require('./helpers/handlebars-helpers') }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

app.use(session({ 
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// 初始化passport模組
app.use(passport.initialize())
app.use(passport.session()) // 如用JWT驗證(不用cookie-based驗證，不使用session)則省略

app.use(flash())
app.use((req, res, next) => {
  // res.locals 是 Express.js 開的一條捷徑，放在 res.locals 裡的資料，所有的 view 都可以存取
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req) // 要放在初始化passport之後
  next()
})


// 掛載總路由器
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`)
})