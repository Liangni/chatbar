const Sequelize = require('sequelize');
const redisConnect = require('../../utility/redis');
const { Group_register } = require('../../models');

const fetchOnlineGroupUserIds = (socket, io) => async (groupId) => {
//   const { user: { RegisteredGroups } } = socket.request;
//   const groupIds = RegisteredGroups.map((group) => group.id);
  const onlineUserIds = (await redisConnect.hkeys('userSocketHash')).map((idString) => parseInt(idString, 10));

  const groupRegisters = await Group_register.findAll(
    {
      where: {
        group_id: groupId,
        user_id: onlineUserIds
      },
      attributes: ['userId'],
      nest: true,
      raw: true
    }
  );

  const onlineGroupUserIds = groupRegisters.map((register) => register.userId);

  io.to(socket.id).emit('getOnlineGroupUserIds', onlineGroupUserIds);
};

module.exports = fetchOnlineGroupUserIds;
