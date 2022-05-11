if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const app = express()
const PORT = 3000
const SESSION_SECRET = 'secret'
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')
const routes = require('./routes')
const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
})

// 設定樣板引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: require('./helpers/handlebars-helpers') }))
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

// 設定 GET 和 POST 以外的路由
app.use(methodOverride('_method'))
// 掛載總路由器
app.use(routes)

// 設定socketIO
const server = http.createServer(app)
const io = new Server(server)
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

io.on("connection", (socket) => {
  
  console.log(`new connection from socketId: ${socket.id}`)

  const registeredGroups = socket.request.user.RegisteredGroups
  registeredGroups.forEach(g => {socket.join(`groupChat${g.id}`)})
  
  // 監聽來自客戶端的chatMessage事件
  socket.on("chatMessage", (ioRoom, senderAccount, message, createdAt) => {
    // 發送chatMessage給特定Room的客戶端
    io.to(ioRoom).emit("chatMessage", ioRoom, senderAccount, message, createdAt);
  });
  
  
  socket.on('disconnect', () => {
    console.log(`socketId:${socket.id} disconnected`)
  })
});

server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`)
})