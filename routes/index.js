const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const groupChats = require('./modules/groupChats')
const apis = require('./modules/apis')
const { generalErrorHandler } = require('../middleware/error-handlers')

router.use('/groupChats', groupChats)
router.use('/users', users)
router.use('/api', apis)
router.use('/', (req, res) => res.redirect('/groupChats'))

// Error Handlers
router.use('/', generalErrorHandler )

module.exports = router