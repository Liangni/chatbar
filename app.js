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
const onlineUsers = []

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
  
  console.log(`new connection from userId:${socket.request.user.id} socketId: ${socket.id}`)
  
  const onlineUserIds = onlineUsers?.map(u => u.id) || []
  const { user } = socket.request
  const isNewLogin = !onlineUserIds.includes(user.id)
  user.groupChatIds = user.RegisteredGroups?.map(g => g.id) || []

  // 將新連線加入連線使用者所屬groupChat的Room
  if (user.groupChatIds) user.groupChatIds.forEach(id => {socket.join(`groupChat${id}`)})
  // 監聽來自客戶端的chatMessage事件
  socket.on("chatMessage", (ioRoom, Sender, message, createdAt) => {
    // 發送chatMessage給特定Room的客戶端
    io.to(ioRoom).emit("chatMessage", ioRoom, Sender, message, createdAt);
  })
  
  console.log(`onlineUserIds before userId${user.id} connecting:`, onlineUserIds)
  if (isNewLogin) { // 連線來自新登入使用者
    // 更新線上使用者名單
    onlineUsers.push({ id: user.id, groupChatIds: user.groupChatIds })
    // 向連線加入的Room發送「新登入」事件，送出連線使用者id
    user.groupChatIds.forEach(id => { io.to(`groupChat${id}`).emit("newLogin", `groupChat${id}`, user.id ) })
  } else { // 連線來自(在不同頁面轉換的)已登入使用者
    // 對該連線的客戶端發送「取得線上使用者」事件
    user.groupChatIds.forEach(id => { 
      const onlineRoomates = onlineUsers.filter(u => u.groupChatIds.includes(id))
      const onlineRoomateIds = onlineRoomates.map(u => u.id)
      console.log(`onlineUser in Room:groupChat${id}`, onlineRoomateIds )
      io.in(`groupChat${id}`).to(socket.id).emit("getOnlineUsers", `groupChat${id}`,onlineRoomateIds)
    })
  }
  console.log(`onlineUserIds after userId${user.id} connecting(updated):`, onlineUsers.map(u => u.id))
  
  
  socket.on('disconnect', () => {
    console.log(`userId:${socket.request.user.id} socketId:${socket.id} disconnected`)
  
    setTimeout( async () => {
      console.log("Delayed for 2 second.")
      const connectedSockets = await io.of('/').fetchSockets()
      const connectedSocketIds = connectedSockets.map(s => s.request.user.id )
      console.log('connectedSocketIds: ', connectedSocketIds)
      // 如namespace已不含剛才disconnect的使用者，表示沒有再次connect，判斷為登出
      const isLogout = !connectedSocketIds.includes(user.id)
      
      if (isLogout) {
        // 更新線上使用者名單
        userIndex = onlineUsers.indexOf({ id: user.id, groupChatIds: user.groupChatIds })
        onlineUsers.splice(userIndex, 1)
        // 向連線加入的Room發送「新登出」事件，送出連線使用者id
        user.groupChatIds.forEach(id => { io.to(`groupChat${id}`).emit("newLogout", `groupChat${id}`, user.id) })
      } 
      console.log('onlineUserIds when a user disconnected:', onlineUsers.map(u => u.id))
    }, 2000)
  })

  socket.on('fetchOnlineUsers', (groupId) => {
    const onlineRoomates = onlineUsers.filter(u => u.groupChatIds.includes(groupId))
    const onlineRoomateIds = onlineRoomates.map(u => u.id)
    console.log(`onlineUser in Room:groupChat${groupId}`, onlineRoomateIds)
    io.in(`groupChat${groupId}`).to(socket.id).emit("getOnlineUsers", `groupChat${groupId}`,onlineRoomateIds)
  })
});

server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`)
})