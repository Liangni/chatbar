const redisConnect = require('../../utility/redis');

const fetchOnlineUserIds = (socket, io) => async () => {
  const onlineUserIds = (await redisConnect.hkeys('userSocketHash')).map((idString) => parseInt(idString, 10));
  io.to(socket.id).emit('getOnlineUserIds', onlineUserIds);
};

module.exports = fetchOnlineUserIds;
