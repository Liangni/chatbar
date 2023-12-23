const redisConnect = require('../../utility/redis')

const privateChatMessage = (socket, io) => async (payload) => {
    const { recieverId, Sender } = payload
    const payloadCopy = JSON.parse(JSON.stringify(payload))

    // 發送chatMessage給寄件者自己
    payloadCopy.chatRoom = `privateChat${recieverId}`
    io.to(socket.id).emit('chatMessage', payloadCopy)

    // 若收件者在線上，則也對其發送chatMessage
    const recieverSocketId = await redisConnect.hget('userSocketHash', recieverId.toString())
    if (!recieverSocketId) return

    payloadCopy.chatRoom = `privateChat${Sender.id}`
    io.to(recieverSocketId).emit('chatMessage', payloadCopy)
}

module.exports = privateChatMessage
