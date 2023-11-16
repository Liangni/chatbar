const express = require('express');

const messageRouter = express.Router();
const messageController = require('../controllers/message-controller');
const { authenticated } = require('../middleware/auth');
const { apiErrorHandler } = require('../middleware/error-handlers');
const cpUpload = require('../middleware/multer');

// userMessages頁面相關
messageRouter.get('/groupMessages', authenticated, messageController.getUserGroupMessages);
messageRouter.post('/groupChats/:groupId/groupMessages', authenticated, cpUpload, messageController.postUserGroupMessages);
messageRouter.get('/privateMessages', authenticated, messageController.getUserPrivateMessages);
messageRouter.post('/privateMessages/recievers/:recieverId', authenticated, cpUpload, messageController.postUserPrivateMessages);

// Error Handlers
messageRouter.use('/', apiErrorHandler);

module.exports = messageRouter;
