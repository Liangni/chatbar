const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const groupChats = require('./modules/groupChats')

router.use('/groupChats', groupChats)
router.use('/users', users)
router.use('/', (req, res) => res.redirect('/groupChats'))

module.exports = router