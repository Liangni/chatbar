const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const PORT = 3000
const routes = require('./routes')

// 設定樣板引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: require('./helpers/handlebars-helpers') }))
app.set('view engine', 'hbs')

// 掛載總路由器
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`)
})