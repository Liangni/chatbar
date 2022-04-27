const express = require('express')
const router = express.Router()
const groupChatController = require('../../controllers/groupChatController')
const { authenticated } = require('../../middleware/auth')

router.get('/', authenticated, groupChatController.getGroupChats)

module.exports = router