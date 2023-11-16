const express = require('express');

const router = express.Router();
const userRouter = require('./user-router');
const groupchatRouter = require('./groupchat-router');
const pageRouter = require('./page-router');
const friendshipRouter = require('./friendship-router');
const messageRouter = require('./message-router');
const { generalErrorHandler } = require('../middleware/error-handlers');

router.use('/pages', pageRouter);
router.use('/users', userRouter);
router.use('/groupChats', groupchatRouter);
router.use('/friendships', friendshipRouter);
router.use('/messages', messageRouter);

router.use('/', (req, res) => res.redirect('/pages/groupChats'));

// Error Handlers
router.use('/', generalErrorHandler);

module.exports = router;
