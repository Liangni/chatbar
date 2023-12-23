const redisConnect = require('../../utility/redis')

const disconnect = (socket, io) => () => {
    const disconnectedSocketId = socket.id

    setTimeout(async () => {
        const { user } = socket.request
        const currentSocketId = await redisConnect.hget('userSocketHash', user.id.toString())

        const isConnectedAgain = (disconnectedSocketId !== currentSocketId)
        if (isConnectedAgain) return

        await redisConnect.hdel('userSocketHash', user.id.toString())

        const userGroupIds = user.RegisteredGroups?.map((group) => group.id)
        io.emit('newLogout', userGroupIds, user.id)
    }, 3000)
}

module.exports = disconnect
