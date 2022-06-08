const dayjs = require('dayjs')
const { Op } = require("sequelize")
const { Group_chat, Group_message, User, Friendship_invitation, Gender, District, Interest, Private_message } = require('../../models')
const { getUser } = require('../../helpers/auth-helpers')
const { formatMessageTime } = require('../../helpers/time-helpers')
const { getDownloadUrl } = require('../../helpers/file-helpers')

const userController = {
  getFriendshipInvitationSenders: async (req, res, next) => {
    try {
      const loginUser = getUser(req)
      const friendshipInvitations = await Friendship_invitation.findAll({
        where: { recieverId: loginUser.id },
        include: {
          model: User,
          include: [Gender, District, { model: Interest, as: 'CurrentInterests' }]
        },
        order: [['createdAt', 'DESC']]
      })
      const friendshipInvitationSenders = friendshipInvitations.map(i => ({
        ...i.User.toJSON(),
        age: dayjs(new Date()).diff(i.User.birthday, 'year'),
        district: i.User.District.name,
        gender: i.User.Gender.name
      }))

      res.json({
        status: 'success',
        friendshipInvitationSenders,
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
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
      groupChatData.chatType = 'groupChat'
      // 為每條訊息加入是否為登入使用者的判斷、調整時間格式
      groupChatData.Group_messages = groupChatData.Group_messages ? groupChatData.Group_messages.map(m => ({
        ...m,
        isLoginUser: (loginUser.id === m.User.id),
        formattedCreatedAt: formatMessageTime(m.createdAt)
      })) : null

      res.json({
        status: 'success',
        unfoldedChat: groupChatData || null
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  postUserGroupMessages: async (req, res, next) => {
    try {
      const loginUser = getUser(req)
      const RegisteredGroupIds = loginUser?.RegisteredGroups?.map(g => g.id) || null
      const groupId = Number(req.params.groupId)
      const { content, fileUrl, imageUrl } = req.body
      const { files } = req

      if (!RegisteredGroupIds || !RegisteredGroupIds.includes(groupId)) throw new Error('你沒有加入此話題')
      if (!content.trim() && !files.file && !files.image) throw new Error('未輸入任何訊息!')

      const imageSrc = imageUrl ? await getDownloadUrl(imageUrl) : null
      const messageData = await Group_message.create({
        groupId,
        userId: loginUser.id,
        content: content ? content : null,
        file: fileUrl ? fileUrl : null,
        image: imageUrl ? imageUrl : null,
        imageSrc: imageSrc ? imageSrc.toString() : null
      })
      newMessage = messageData.toJSON()
      newMessage.formattedCreatedAt = formatMessageTime(newMessage.createdAt)
      newMessage.User = { id: loginUser.id, account: loginUser.account, avatar: loginUser.avatar }
      res.json({ status: 'success', message: newMessage })

    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getUserPrivateMessages: async (req, res, next) => {
    try {
      const loginUser = getUser(req)
      const friends = loginUser.Friends
      const userId = req.query ? Number(req.query.userId) : null

      let givenFriend
      if (userId) {
        // 檢查朋友關係是否存在，若不存在則結束處理
        givenFriend = friends.filter(friend => friend.id === userId)
        if (!givenFriend.length) throw new Error('朋友關係不存在或已解除，無法查看訊息')
      }

      const privateMessagesData = await Private_message.findAll({
        where: {
          [Op.or]: [
            { senderId: loginUser.id, recieverId: givenFriend[0].id },
            { senderId: givenFriend[0].id, recieverId: loginUser.id }
          ]
        },
        include: [{ model: User, as: 'Sender' }, { model: User, as: 'Reciever' }],
        order: [['createdAt', 'ASC']],
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
      let unfoldedPrivateChat = {
        id: givenFriend ? givenFriend[0].id : latestPrivateMessges[0].id,
        name: givenFriend ? givenFriend[0].account : latestPrivateMessges[0].name,
        photo: givenFriend ? givenFriend[0].avatar : latestPrivateMessges[0].avatar,
        chatType: 'privateChat',
        Private_messages: Private_messages.length ? Private_messages : null
      }
      res.json({
        status: 'success',
        unfoldedChat: unfoldedPrivateChat
      })

    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  postUserPrivateMessages: async (req, res, next) => {
    try {
      const loginUser = getUser(req)
      const friends = loginUser.Friends
      const recieverId = Number(req.params.recieverId)
      const { content, fileUrl, imageUrl } = req.body
      const { files } = req
      
      // 檢查朋友關係是否存在，若不存在則結束處理
      let givenFriend = friends.filter(friend => friend.id === recieverId)
      if (!givenFriend.length) throw new Error('朋友關係不存在或已解除，無法發送訊息')
      if (!content.trim() && !files.file && !files.image) throw new Error('未輸入任何訊息!')

      const imageSrc = imageUrl ? await getDownloadUrl(imageUrl) : null
      const messageData = await Private_message.create({
        recieverId,
        senderId: loginUser.id,
        content: content ? content : null,
        file: fileUrl ? fileUrl : null,
        image: imageUrl ? imageUrl : null,
        imageSrc: imageSrc ? imageSrc.toString() : null
      })
      newMessage = messageData.toJSON()
      newMessage.formattedCreatedAt = formatMessageTime(newMessage.createdAt)
      newMessage.User = { id: loginUser.id, account: loginUser.account, avatar: loginUser.avatar}
      
      res.json({ status: 'success', message: newMessage })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController
