const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const PORT = 3000
const SESSION_SECRET = 'secret'
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
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

// 掛載總路由器
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`)
})