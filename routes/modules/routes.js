const express = require('express')
const router = express.Router()

router.get('/', (req, res) =>{
  res.send('The request is successfully led to routes!')
})

module.exports = router