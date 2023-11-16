const express = require('express');

const pageRouter = express.Router();
const pageController = require('../controllers/page-controller');
const { authenticated } = require('../middleware/auth');

// 註冊登入頁面
pageRouter.get('/login', pageController.loginPage);
pageRouter.get('/register', pageController.registerPage);

// 群組話題頁面
pageRouter.get('/groupChats', authenticated, pageController.getGroupChatsPage);

// 全站使用者頁面
pageRouter.get('/users', authenticated, pageController.getUsersPage);

// 使用者訊息
pageRouter.get('/messages', pageController.getMessagesPage);
pageRouter.get('/groupMessages', authenticated, pageController.getGroupMessagesPage);
pageRouter.get('/privateMessages', authenticated, pageController.getPrivateMessagesPage);

module.exports = pageRouter;
