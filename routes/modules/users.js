const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userContorller')

router.get('/login', userController.loginPage)

module.exports = router