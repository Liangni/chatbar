const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const sessionMiddleware = require('./middleware/session-middleware')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')
const requestLogger = require('./middleware/request-logger')
const routes = require('./routes')

const app = express()

// 設定樣板引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(sessionMiddleware)

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

app.use(requestLogger)

// 設定 GET 和 POST 以外的路由
app.use(methodOverride('_method'))
// 掛載總路由器
app.use(routes)

module.exports = app
