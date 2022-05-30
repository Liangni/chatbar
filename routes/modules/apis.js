const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const userController = require('../../controllers/api/userController')
const { apiErrorHandler }= require('../../middleware/error-handlers')
const cpUpload = require('../../middleware/multer')

// userList頁面相關
router.get('/users/loginUser/friendshipInviations/senders', authenticated, userController.getFriendshipInvitationSenders)

// userMessages頁面相關
router.get('/users/loginUser/groupChats/groupMessages', authenticated, userController.getUserGroupMessages)
router.post('/users/loginUser/groupChats/:groupId/groupMessages', authenticated, cpUpload, userController.postUserGroupMessages)

// Error Handlers
router.use('/', apiErrorHandler)

module.exports = router