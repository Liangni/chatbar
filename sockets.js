/* eslint-disable no-param-reassign */
const { wrap, authenticate } = require('./middleware/sockets');
const sessionMiddleware = require('./middleware/session-middleware');
const passport = require('./config/passport');
const onConnection = require('./api/io-events/connection');
const socketEvents = require('./api/socket-events');

function init(io) {
  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
  io.use(authenticate);
}

function listen(io) {
  init(io);

  io.on('connection', onConnection(io, socketEvents));

  // const onlineUsers = [];
  // io.on('connection', (socket) => {
  //   const onlineUserIds = onlineUsers?.map((u) => u.id) || [];
  //   const { user } = socket.request;
  //   const isNewLogin = !onlineUserIds.includes(user.id);
  //   user.groupChatIds = user.RegisteredGroups?.map((g) => g.id) || [];

  //   // 將新連線加入連線使用者所屬groupChat的chatRoom
  //   if (user.groupChatIds) user.groupChatIds.forEach((id) => { socket.join(`groupChat${id}`); });

  //   // 如連線來自新登入使用者
  //   if (isNewLogin) {
  //     // 更新線上使用者名單
  //     onlineUsers.push({ id: user.id, groupChatIds: user.groupChatIds });
  //     // 向所有連線發送「登入」事件，送出連線使用者id和加入的groupIds
  //     io.emit('newLogin', user.groupChatIds, user.id);
  //   } else {
  //     // 如連線來自原線上使用者，更新使用者groupChatId資訊
  //     onlineUsers.map((u) => {
  //       if (u.id === user.id) {
  //         u.groupChatIds = user.groupChatIds;
  //       }
  //     });
  //   }

  //   // 監聽來自客戶端的chatMessage事件
  //   socket.on('groupChatMessage', (payload) => {
  //     // 發送chatMessage給特定Room的客戶端
  //     io.to(payload.chatRoom).emit('chatMessage', payload);
  //   });

  //   socket.on('privateChatMessage', async (payload) => {
  //     const { recieverId, Sender } = payload;
  //     payload.chatRoom = `privateChat${recieverId}`;
  //     // 發送chatMessage給送出私人訊息的客戶端
  //     io.to(socket.id).emit('chatMessage', payload);

  //     // 若預計接收私人訊息的客戶端在線上，則也對其發送chatMessage
  //     if (onlineUsers.find((User) => User.id === recieverId)) {
  //       const connectedSockets = await io.of('/').fetchSockets();
  //       const recieverSocket = connectedSockets.find((s) => s.request.user.id === recieverId);
  //       payload.chatRoom = `privateChat${Sender.id}`;

  //       io.to(recieverSocket.id).emit('chatMessage', payload);
  //     }
  //   });

  //   // 監聽來自客戶端的「更新線上使用者名單」事件
  //   socket.on('fetchOnlineUsers', () => {
  //     io.to(socket.id).emit('getOnlineUsers', onlineUsers);
  //   });

  //   socket.on('fetchOnlineUserIds', () => {
  //     io.to(socket.id).emit('getOnlineUserIds', onlineUserIds);
  //   });

  //   socket.on('fetchOnlineGroupUserIds', (groupId) => {
  //     const onlineRoomates = onlineUsers.filter((u) => u.groupChatIds.includes(groupId));
  //     const onlineRoomateIds = onlineRoomates.map((u) => u.id);

  //     io.to(socket.id).emit('getOnlineGroupUserIds', onlineRoomateIds);
  //   });

  //   // 監聽中斷連線事件事件
  //   socket.on('disconnect', () => {
  //     setTimeout(async () => {
  //       const connectedSockets = await io.of('/').fetchSockets();
  //       const connectedUserIds = connectedSockets.map((s) => s.request.user.id);
  //       // 如namespace已不含剛才disconnect的使用者，表示沒有再次connect，判斷為登出
  //       const isLogout = !connectedUserIds.includes(user.id);

  //       if (isLogout) {
  //         // 更新線上使用者名單
  //         const userIndex = onlineUsers.indexOf({ id: user.id, groupChatIds: user.groupChatIds });
  //         onlineUsers.splice(userIndex, 1);
  //         // 向所有線上使用者發送「登出」事件，送出連線使用者id
  //         io.emit('newLogout', user.groupChatIds, user.id);
  //       }
  //     }, 2000);
  //   });
  // });
}

module.exports = { listen };
