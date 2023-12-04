const onConnection = (io, socketEvents) => (socket) => {
  // 加入參與的 chatRoom
  const { user } = socket.request;
  const userGroupChatIds = user.RegisteredGroups?.map((g) => g.id) || [];

  if (userGroupChatIds.length) {
    userGroupChatIds.forEach((id) => { socket.join(`groupChat${id}`); });
  }

  //  監聽 socket events
  Object.keys(socketEvents).forEach((key) => {
    const fn = socketEvents[key](socket, io);
    socket.on(key, fn);
  });
};

module.exports = onConnection;
