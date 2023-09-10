if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const http = require('http')
const io = require('socket.io')

const apiServer = require('./app')
const httpServer = http.createServer(apiServer)
const socketServer = io(httpServer)

const sockets = require('./sockets')

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`)
})
sockets.listen(socketServer)