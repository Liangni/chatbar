const onConnection = (io, socketEvents) => (socket) => {
  const { user } = socket.request;

  // 加入參與的 chatRoom
  const roomIds = user.RegisteredGroups?.map((g) => g.id) || [];
  roomIds.forEach((id) => { socket.join(`groupChat${id}`); });

  // 監聽 socket events
  Object.keys(socketEvents).forEach((key) => {
    const fn = socketEvents[key](socket, io);
    socket.on(key, fn);
  });
};

module.exports = onConnection;
