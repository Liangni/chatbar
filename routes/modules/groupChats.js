const express = require('express')
const router = express.Router()
const groupChatController = require('../../controllers/groupChatController')
const { authenticated } = require('../../middleware/auth')

router.get('/', authenticated, groupChatController.getGroupChats)
router.post('/', authenticated, groupChatController.postGroupChats)
router.post('/:groupId/groupRegisters', authenticated, groupChatController.postGroupRegisters)
router.delete('/:groupId/groupRegisters', authenticated, groupChatController.deleteGroupRegisters)

module.exports = router