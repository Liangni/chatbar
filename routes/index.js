const express = require('express')
const router = express.Router()
const routes = require('./modules/routes')

router.use('/', routes)

module.exports = router