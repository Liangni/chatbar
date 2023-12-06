const redisConnect = require('../../utility/redis');

const onConnection = (io, socketEvents) => async (socket) => {
  const { user } = socket.request;

  // 確認 redis 是否有前次連線資訊，無則發布「新登入事件」
  const previousSocketId = await redisConnect.hget('userSocketHash', user.id.toString());
  if (!previousSocketId) io.emit('newLogin', user.groupChatIds, user.id);

  await redisConnect.hset('userSocketHash', user.id.toString(), socket.id);

  // 加入參與的 chatRoom
  user.RegisteredGroups?.forEach((group) => socket.join(`groupChat${group.id}`));

  // 監聽 socket events
  Object.keys(socketEvents).forEach((key) => {
    const fn = socketEvents[key](socket, io);
    socket.on(key, fn);
  });

  // 發送 connected event 告知客戶端 server 已準備好
  io.to(socket.id).emit('connected');
};

module.exports = onConnection;
