const { Group_chat, Group_message, User } = require('../../models')
const { getUser } = require('../../helpers/auth-helpers')
const { formatMessageTime } = require('../../helpers/time-helpers')

const userController = {
  getUserGroupMessages: async (req, res, next) => {
    try {
      const loginUser = getUser(req)
      const RegisteredGroupIds = loginUser?.RegisteredGroups?.map(g => g.id) || null
      const groupId = req.query ? Number(req.query.groupId) : null
      

      if (groupId) {
        if (!RegisteredGroupIds || !RegisteredGroupIds.includes(groupId)) throw new Error('使用者沒有加入此話題')
      }

      // 如登入使用者有加入話題，找出相關groupChat資料
      const groupChat = await Group_chat.findByPk(groupId, {
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

      res.json({
        status: 'success',
        unfoldedGroupChat: groupChatData || null
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}

module.exports = userController
