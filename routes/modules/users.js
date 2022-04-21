const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userContorller')

// 暫時用userId 1
router.get('/1/messages', userController.getUserMessages)

router.get('/login', userController.loginPage)
router.get('/register', userController.registerPage)

module.exports = router