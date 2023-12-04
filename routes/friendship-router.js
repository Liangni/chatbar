const express = require('express');

const friendshipRouter = express.Router();
const friendshipController = require('../api/controllers/friendship-controller');
const { authenticated } = require('../middleware/auth');
const { apiErrorHandler } = require('../middleware/error-handlers');

// 朋友關係
friendshipRouter.post('/users/:userId/friendshipInvitations', authenticated, friendshipController.postFriendshipInvitations);
friendshipRouter.delete('/users/:userId/friendshipInvitations', authenticated, friendshipController.deleteFriendshipInvitations);
friendshipRouter.post('/users/:userId/friendships', authenticated, friendshipController.postFriendships);
friendshipRouter.delete('/users/:userId/friendships', authenticated, friendshipController.deleteFriendships);

friendshipRouter.get('/friendshipInviations/senders', authenticated, friendshipController.getFriendshipInvitationSenders, apiErrorHandler);

module.exports = friendshipRouter;
