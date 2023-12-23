require('dotenv').config()

const http = require('http')
const io = require('socket.io')
const redisConnect = require('./utility/redis')

const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env

redisConnect.init({
    password: REDIS_PASSWORD,
    host: REDIS_HOST,
    port: REDIS_PORT
})

const apiServer = require('./app')

const httpServer = http.createServer(apiServer)
const socketServer = io(httpServer)

const sockets = require('./sockets')

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
    console.log(`App is running on port ${PORT}!`)
})
sockets.listen(socketServer)
