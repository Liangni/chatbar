const express = require('express')

const groupchatRouter = express.Router()
const groupChatController = require('../api/controllers/groupchat-controller')
const { authenticated } = require('../middleware/auth')

groupchatRouter.post('/', authenticated, groupChatController.postGroupChats)
groupchatRouter.post('/:groupId/groupRegisters', authenticated, groupChatController.postGroupRegisters)
groupchatRouter.delete('/:groupId/groupRegisters', authenticated, groupChatController.deleteGroupRegisters)

module.exports = groupchatRouter
