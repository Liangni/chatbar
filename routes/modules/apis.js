const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const userController = require('../../controllers/api/userController')
const { apiErrorHandler }= require('../../middleware/error-handlers')

router.get('/users/loginUser/groupChats/groupMessages', authenticated, userController.getUserGroupMessages)

// Error Handlers
router.use('/', apiErrorHandler)

module.exports = router