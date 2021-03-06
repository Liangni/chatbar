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
const PORT = process.env.PORT || 3000
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
  const onlineUserIds = onlineUsers?.map(u => u.id) || []
  const { user } = socket.request
  const isNewLogin = !onlineUserIds.includes(user.id)
  user.groupChatIds = user.RegisteredGroups?.map(g => g.id) || []

  // 將新連線加入連線使用者所屬groupChat的chatRoom
  if (user.groupChatIds) user.groupChatIds.forEach(id => {socket.join(`groupChat${id}`)})

  // 如連線來自新登入使用者
  if (isNewLogin) {
    // 更新線上使用者名單
    onlineUsers.push({ id: user.id, groupChatIds: user.groupChatIds })
    // 向所有連線發送「登入」事件，送出連線使用者id和加入的groupIds
    io.emit("newLogin", user.groupChatIds, user.id)
  } else {
    // 如連線來自原線上使用者，更新使用者groupChatId資訊
    onlineUsers.map(u => { if (u.id === user.id) { u.groupChatIds = user.groupChatIds}})
  }

  // 監聽來自客戶端的chatMessage事件
  socket.on("groupChatMessage", (chatRoom, Sender, content, createdAt, file, imageSrc) => {
    // 發送chatMessage給特定Room的客戶端
    io.to(chatRoom).emit("chatMessage", chatRoom, Sender, content, createdAt, file, imageSrc);
  })
  socket.on("privateChatMessage", async (recieverId, Sender, content, createdAt, file, imageSrc) => {
    // 發送chatMessage給送出私人訊息的客戶端
    io.to(socket.id).emit("chatMessage", `privateChat${recieverId}`, Sender, content, createdAt, file, imageSrc)
    // 若預計接收私人訊息的客戶端在線上，則也對其發送chatMessage
    if (onlineUsers.find(User => User.id === recieverId)) {
      const connectedSockets = await io.of('/').fetchSockets()
      const recieverSocket = connectedSockets.find(s => s.request.user.id === recieverId )

      io.to(recieverSocket.id).emit("chatMessage", `privateChat${Sender.id}`, Sender, content, createdAt, file, imageSrc)
    }
  })
  // 監聽來自客戶端的「更新線上使用者名單」事件
  socket.on('fetchOnlineUsers', () => {
    io.to(socket.id).emit("getOnlineUsers", onlineUsers)
  })
  
  socket.on('fetchOnlineUserIds', () => {
    io.to(socket.id).emit("getOnlineUserIds", onlineUserIds)
  })

  socket.on('fetchOnlineGroupUserIds', (groupId) => {
    const onlineRoomates = onlineUsers.filter(u => u.groupChatIds.includes(groupId))
    const onlineRoomateIds = onlineRoomates.map(u => u.id)
    
    io.to(socket.id).emit("getOnlineGroupUserIds", onlineRoomateIds)
  })
  // 監聽中斷連線事件事件
  socket.on('disconnect', () => {
    setTimeout( async () => {
      const connectedSockets = await io.of('/').fetchSockets()
      const connectedUserIds = connectedSockets.map(s => s.request.user.id )
      // 如namespace已不含剛才disconnect的使用者，表示沒有再次connect，判斷為登出
      const isLogout = !connectedUserIds.includes(user.id)
      
      if (isLogout) {
        // 更新線上使用者名單
        userIndex = onlineUsers.indexOf({ id: user.id, groupChatIds: user.groupChatIds })
        onlineUsers.splice(userIndex, 1)
        // 向所有線上使用者發送「登出」事件，送出連線使用者id
        io.emit("newLogout", user.groupChatIds, user.id)
      } 
    }, 2000)
  })

});

server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`)
})