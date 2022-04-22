const express = require('express')
const router = express.Router()
const routes = require('./modules/routes')
const users = require('./modules/users')

router.use('/users', users)
router.use('/', routes)

module.exports = router