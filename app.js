const express = require('express')
const app = express()
const PORT = 3000
const routes = require('./routes')

// 掛載總路由器
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`)
})