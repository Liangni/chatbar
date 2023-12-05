const redisConnect = require('../../utility/redis');

const onConnection = (io, socketEvents) => async (socket) => {
  const { user } = socket.request;

  await redisConnect.hset('userSocketHash', user.id.toString(), socket.id);

  // 加入參與的 chatRoom
  const roomIds = user.RegisteredGroups?.map((group) => group.id) || [];
  roomIds.forEach((id) => { socket.join(`groupChat${id}`); });

  // 監聽 socket events
  Object.keys(socketEvents).forEach((key) => {
    const fn = socketEvents[key](socket, io);
    socket.on(key, fn);
  });
};

module.exports = onConnection;
