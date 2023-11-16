/* eslint-disable camelcase */
const {
  Group_chat, Group_register, Group_message
} = require('../models');
const { getUser } = require('../helpers/auth-helpers');

const groupChatController = {
  postGroupChats: async (req, res, next) => {
    try {
      const { name } = req.body;
      const loginUser = getUser(req);
      if (name.trim() === '') throw new Error('話題名稱不可為空白!');
      const newGroupChat = await Group_chat.create({
        name,
        userId: loginUser.id
      });
      await Group_register.create({
        groupId: newGroupChat.id,
        userId: loginUser.id
      });
      req.flash('success_messages', '成功開啟話題!');
      res.redirect('/pages/groupChats');
    } catch (err) {
      next(err);
    }
  },
  postGroupRegisters: async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const loginUser = getUser(req);
      const groupRegister = await Group_register.findOne({
        where: {
          groupId,
          userId: loginUser.id
        }
      });
      if (groupRegister) throw new Error('使用者已經加入話題!');
      await Group_register.create({
        groupId,
        userId: loginUser.id
      });
      req.flash('success_messages', '成功加入話題!');
      res.redirect('/pages/groupChats');
    } catch (err) {
      next(err);
    }
  },
  deleteGroupRegisters: async (req, res, next) => {
    try {
      const currentUrl = req.headers.referer;
      const { groupId } = req.params;
      const groupRegister = await Group_register.findOne({
        where: {
          groupId,
          userId: getUser(req).id
        }
      });
      if (!groupRegister) throw new Error('你未加入話題或話題不存在!');
      await groupRegister.destroy();
      const groupRegisterCount = await Group_register.count({ where: { groupId } });
      // 如已沒有使用者加入話題，刪除話題(groupChat)
      if (groupRegisterCount === 0) {
        // 先刪除相關的Group_message，否則因外鍵限制無法刪除該groupChat
        const groupMessages = await Group_message.findAll({ where: { groupId } });
        if (groupMessages) groupMessages.forEach((m) => m.destroy());
        const groupChat = await Group_chat.findByPk(groupId);
        if (groupChat) { groupChat.destroy(); }
      }
      req.flash('success_messages', '你已退出話題!');
      if (currentUrl.indexOf('/pages/groupMessages') !== -1) {
        res.redirect('/pages/groupMessages');
      }
      res.redirect('back');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = groupChatController;
