/* eslint-disable arrow-body-style */
/* eslint-disable camelcase */
const { Op } = require('sequelize');
const {
  Group_chat,
  Group_message,
  User,
  Private_message
} = require('../../models');
const { getUser } = require('../../helpers/auth-helpers');
const { formatMessageTime } = require('../../helpers/time-helpers');
const { uploadPromise } = require('../../services/aws');

const messageController = {
  getUserGroupMessages: async (req, res, next) => {
    try {
      const loginUser = getUser(req);
      const RegisteredGroupIds = loginUser?.RegisteredGroups?.map((g) => g.id) || null;
      const groupId = req.query ? Number(req.query.groupId) : null;

      if (groupId) {
        if (!RegisteredGroupIds || !RegisteredGroupIds.includes(groupId)) throw new Error('使用者沒有加入此話題');
      }

      // 如登入使用者有加入話題，找出相關groupChat資料
      const groupChat = await Group_chat.findByPk(groupId, {
        include: [
          { model: Group_message, include: [User] },
          User,
          { model: User, as: 'RegisteredUsers' }
        ],
        order: [[Group_message, 'createdAt', 'ASC']]
      });
      const groupChatData = groupChat.toJSON();
      groupChatData.chatType = 'groupChat';
      // 為每條訊息加入是否為登入使用者的判斷、調整時間格式
      groupChatData.Group_messages = groupChatData.Group_messages
        ? groupChatData.Group_messages.map((m) => ({
          ...m,
          isLoginUser: (loginUser.id === m.User.id),
          formattedCreatedAt: formatMessageTime(m.createdAt)
        }))
        : null;

      res.json({
        status: 'success',
        unfoldedChat: groupChatData || null
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  postUserGroupMessages: async (req, res, next) => {
    try {
      const loginUser = getUser(req);
      const RegisteredGroupIds = loginUser?.RegisteredGroups?.map((g) => g.id) || null;
      const groupId = Number(req.params.groupId);
      const { content = null, imageUrl = null } = req.body;
      let { fileUrl = null, imageSrc = null } = req.body;
      const { files } = req;

      if (!RegisteredGroupIds || !RegisteredGroupIds.includes(groupId)) throw new Error('你沒有加入此話題');
      if ((!content || !content.trim()) && !files.file && !files.image) throw new Error('未輸入任何訊息!');

      if (files.image || files.file) {
        const { buffer, mimetype } = files.image?.[0] || files.file[0];

        const params = {
          Bucket: `chatbar/users/${loginUser.id}`,
          Key: `${Date.now()}.${mimetype.split('/')[1]}`,
          Body: buffer,
          ContentType: mimetype
          // ACL: 'public-read',
        };

        const awsUrl = await uploadPromise(params);

        if (mimetype.includes('image')) {
          imageSrc = awsUrl;
        } else {
          fileUrl = awsUrl;
        }
      }

      const messageData = await Group_message.create({
        groupId,
        userId: loginUser.id,
        content,
        file: fileUrl,
        image: imageUrl,
        imageSrc
      });

      const newMessage = messageData.toJSON();
      newMessage.formattedCreatedAt = formatMessageTime(newMessage.createdAt);
      newMessage.User = { id: loginUser.id, account: loginUser.account, avatar: loginUser.avatar };
      res.json({ status: 'success', message: newMessage });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  getUserPrivateMessages: async (req, res, next) => {
    try {
      const loginUser = getUser(req);
      const friends = loginUser.Friends;
      const friendId = req.query ? Number(req.query.userId) : null;

      let currentFriend;
      if (friendId) {
        // 檢查朋友關係是否存在，若不存在則結束處理
        currentFriend = friends.filter((friend) => friend.id === friendId);
        if (!currentFriend.length) throw new Error('朋友關係不存在或已解除，無法查看訊息');
      }

      const privateMessagesData = await Private_message.findAll({
        where: {
          [Op.or]: [
            { senderId: loginUser.id, recieverId: currentFriend[0].id },
            { senderId: currentFriend[0].id, recieverId: loginUser.id }
          ]
        },
        include: [{ model: User, as: 'Sender' }, { model: User, as: 'Reciever' }],
        order: [['createdAt', 'ASC']],
        raw: true,
        nest: true
      });

      const Private_messages = privateMessagesData.map((message) => ({
        ...message,
        User: message.Sender,
        isLoginUser: (loginUser.id === message.senderId),
        formattedCreatedAt: formatMessageTime(message.createdAt)
      }));

      const unfoldedPrivateChat = {
        id: currentFriend[0].id,
        name: currentFriend[0].account,
        photo: currentFriend[0].avatar,
        chatType: 'privateChat',
        Private_messages: Private_messages.length ? Private_messages : null
      };
      res.json({
        status: 'success',
        unfoldedChat: unfoldedPrivateChat
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  postUserPrivateMessages: async (req, res, next) => {
    try {
      const loginUser = getUser(req);
      const friends = loginUser.Friends;
      const recieverId = Number(req.params.recieverId);
      const { content = null, imageUrl = null } = req.body;
      let { fileUrl = null, imageSrc = null } = req.body;
      const { files } = req;

      // 檢查朋友關係是否存在，若不存在則結束處理
      const givenFriend = friends.filter((friend) => friend.id === recieverId);
      if (!givenFriend.length) throw new Error('朋友關係不存在或已解除，無法發送訊息');
      if ((!content || !content.trim()) && !files.file && !files.image) throw new Error('未輸入任何訊息!');

      if (files.image || files.file) {
        const { buffer, mimetype } = files.image?.[0] || files.file[0];

        const params = {
          Bucket: `chatbar/users/${loginUser.id}`,
          Key: `${Date.now()}.${mimetype.split('/')[1]}`,
          Body: buffer,
          ContentType: mimetype
          // ACL: 'public-read',
        };

        const awsUrl = await uploadPromise(params);

        if (mimetype.includes('image')) {
          imageSrc = awsUrl;
        } else {
          fileUrl = awsUrl;
        }
      }

      const messageData = await Private_message.create({
        recieverId,
        senderId: loginUser.id,
        content,
        file: fileUrl,
        image: imageUrl,
        imageSrc
      });
      const newMessage = messageData.toJSON();
      newMessage.formattedCreatedAt = formatMessageTime(newMessage.createdAt);
      newMessage.User = { id: loginUser.id, account: loginUser.account, avatar: loginUser.avatar };

      res.json({ status: 'success', message: newMessage });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
};

module.exports = messageController;
