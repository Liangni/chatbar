// 監聽來自客戶端的chatMessage事件
const groupChatMessage = (socket, io) => (payload) => {
    // 發送chatMessage給特定Room的客戶端
    io.to(payload.chatRoom).emit('chatMessage', payload)
}

module.exports = groupChatMessage
