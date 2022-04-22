const express = require('express')
const router = express.Router()
const groupChatController = require('../../controllers/groupChatController')

router.get('/', groupChatController.getGroupChats)

module.exports = router