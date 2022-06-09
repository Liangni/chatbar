const { Op } = require("sequelize")
const { User,  Group_message, Group_chat, Private_message } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { formatMessageTime } = require('../helpers/time-helpers')

const userServices = { 
  getUserGroupMessages: async (req, cb) => {
    try {
      const loginUser = getUser(req)
      const RegisteredGroupIds = loginUser?.RegisteredGroups?.map(g => g.id) || null
      const groupId = req.query ? Number(req.query.groupId) : null
      let groupChats

      if (groupId) {
        if (!RegisteredGroupIds || !RegisteredGroupIds.includes(groupId)) throw new Error('你沒有加入此話題')
      }

      // 如登入使用者有加入話題，找出相關groupChat資料
      if (RegisteredGroupIds) {
        groupChats = await Promise.all(RegisteredGroupIds.map(async rgid => {
          const groupChat = await Group_chat.findByPk(rgid, {
            include: [
              { model: Group_message, include: [User] },
              User,
              { model: User, as: 'RegisteredUsers' }
            ],
            order: [[Group_message, 'createdAt', 'ASC']]
          })
          const groupChatData = groupChat.toJSON()
          // 為每條訊息加入是否為登入使用者的判斷、調整時間格式
          groupChatData.Group_messages = groupChatData.Group_messages ? groupChatData.Group_messages.map(m => ({
            ...m,
            isLoginUser: (loginUser.id === m.User.id),
            formattedCreatedAt: formatMessageTime(m.createdAt)
          })) : null


          // 取出最近一則訊息，取出前先拷貝groupMessages的值，避免更動groupMessages
          const groupMessageData = groupChatData.Group_messages ? JSON.parse(JSON.stringify(groupChatData.Group_messages)) : null
          const latestMessage = groupMessageData?.[groupMessageData.length - 1] || null
          if (latestMessage) {
            // 刪減過長的訊息文字
            if (latestMessage.content && latestMessage.content.length > 15) {
              latestMessage.content = latestMessage.content.substring(0, 14) + '...'
            }
          }

          // 返回前端需要的groupChat資訊, 與相關的最近一則訊息
          return {
            id: groupChatData.id,
            name: groupChatData.name,
            latestMessage,
            chatType: 'groupChat',
            User: groupChatData.User,
            RegisteredUsers: groupChatData.RegisteredUsers,
            Group_messages: groupChatData.Group_messages,
          }
        }))

        // 將groupChat按日期新->舊排序，沒有訊息的chat置底
        let chatsWithNoMessage = []
        for (let i = groupChats.length - 1; i >= 0; i = i - 1) {
          if (groupChats[i].Group_messages.length === 0) {
            const removed = groupChats.splice(i, 1)
            chatsWithNoMessage.unshift(...removed)
          }
        }
        const chatsWithMessage = groupChats.sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt))
        groupChats = chatsWithMessage.concat(chatsWithNoMessage)
      }

      // 選擇要顯示所有訊息的groupChat
      let unfoldedGroupChat
      if (groupId) {
        unfoldedGroupChat = groupChats.find(i => i.id === groupId)
      } else {
        unfoldedGroupChat = groupChats[0]
      }

      return cb(null, {
        chats: groupChats || null,
        unfoldedChat: unfoldedGroupChat || null
      })
    } catch (err) {
      cb(err)
    }
  },
  getUserPrivateMessages: async (req, cb) => {
    try {
      const loginUser = getUser(req)
      const friends = loginUser.Friends
      const userId = req.query ? Number(req.query.userId) : null

      let givenFriend
      if (userId) {
        // 檢查朋友關係是否存在，若不存在則結束處理
        givenFriend = friends.filter(friend => friend.id === userId)
        if (!givenFriend.length) throw new Error('朋友關係不存在或已解除，無法查看對話')
      }

      // 整理左側聊天列表
      let latestPrivateMessges = friends.length ? await Promise.all(friends.map(async friend => {
        const MessageData = await Private_message.findOne({
          where: {
            [Op.or]: [
              { senderId: loginUser.id, recieverId: friend.id },
              { senderId: friend.id, recieverId: loginUser.id }
            ]
          },
          order: [['createdAt', 'DESC']]
        })

        if (MessageData) {
          // 刪減過長的訊息文字
          if (MessageData.content && MessageData.content.length > 15) {
            MessageData.content = MessageData.content.substring(0, 14) + '...'
          }
        }

        const Message = MessageData ? {
          ...MessageData.toJSON(),
          User: friend,
          isLoginUser: (loginUser.id === MessageData.senderId),
          formattedCreatedAt: formatMessageTime(MessageData.createdAt)
        } : null

        return {
          id: friend.id,
          name: friend.account,
          avatar: friend.avatar,
          chatType: 'privateChat',
          latestMessage: Message
        }
      })) : null

      if (latestPrivateMessges) {
        latestPrivateMessges = latestPrivateMessges.sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt))
      }

      // 若左側聊天列表資料存在，整理右側展開訊息
      let unfoldedPrivateChat
      if (friends.length) {
        const privateMessagesData = await Private_message.findAll({
          where: {
            [Op.or]: [
              { senderId: loginUser.id, recieverId: givenFriend ? givenFriend[0].id : latestPrivateMessges[0].id },
              { senderId: givenFriend ? givenFriend[0].id : latestPrivateMessges[0].id, recieverId: loginUser.id }
            ]
          },
          include: [{ model: User, as: 'Sender' }, { model: User, as: 'Reciever' }],
          raw: true,
          nest: true
        })
        const Private_messages = privateMessagesData.map(message => {
          return {
            ...message,
            User: message.Sender,
            isLoginUser: (loginUser.id === message.senderId),
            formattedCreatedAt: formatMessageTime(message.createdAt)
          }
        })

        unfoldedPrivateChat = {
          id: givenFriend ? givenFriend[0].id : latestPrivateMessges[0].id,
          name: givenFriend ? givenFriend[0].account : latestPrivateMessges[0].name,
          photo: givenFriend ? givenFriend[0].avatar : latestPrivateMessges[0].avatar,
          chatType: 'privateChat',
          Private_messages: Private_messages.length ? Private_messages : null
        }
      }

      cb(null, {
        chats: latestPrivateMessges,
        unfoldedChat: unfoldedPrivateChat || null
      })

    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices