const redisConnect = require('../../utility/redis')
const { User, Group_chat } = require('../../models')

// 監聽來自客戶端的「更新線上使用者名單」事件
const fetchOnlineUsers = (socket, io) => async () => {
    const userSocketHash = await redisConnect.hgetall('userSocketHash')
    const userIds = Object.keys(userSocketHash).map((id) => parseInt(id, 10))

    const users = await User.findAll({
        where: { id: userIds },
        attributes: ['id'],
        include: [{ model: Group_chat, as: 'RegisteredGroups', attributes: ['id'] }]
    })

    const onlineUsers = users.map((user) => ({
        id: user.id,
        groupChatIds: user.RegisteredGroups.map((group) => group.id)
    }))

    io.to(socket.id).emit('getOnlineUsers', onlineUsers)
}

module.exports = fetchOnlineUsers
