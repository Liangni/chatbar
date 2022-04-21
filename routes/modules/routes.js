const express = require('express')
const router = express.Router()
const groupChatController = require('../../controllers/groupChatController')

router.get('/', (req, res) =>{
  res.render('example')
})

router.get('/groupChats', groupChatController.getGroupChats)

module.exports = router