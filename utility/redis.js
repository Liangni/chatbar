const Redis = require('ioredis')

let client
const redisConnect = {
    init({ password, host, port }) {
        client = new Redis({
            host,
            password,
            port
        })
    },
    async get(key) {
        if (!key) return null
        const val = await client.get(key)
        return val
    },
    async set(key, value = '1', options = {}) {
        if (!value) return

        let { cacheTime } = options
        cacheTime = cacheTime || 60 * 60 * 10

        await client.set(key, value, 'EX', cacheTime)
    },
    async hget(key, field) {
        if (!key || !field) return null

        const val = await client.hget(key, field)
        return val
    },
    async hset(key, field, val) {
        if (!key || !field) return

        await client.hset(key, field, val)
    },
    async hgetall(key) {
        if (!key) return

        const result = await client.hgetall(key)
        // eslint-disable-next-line consistent-return
        return result
    },
    async hkeys(key) {
        if (!key) return

        const fields = await client.hkeys(key)
        // eslint-disable-next-line consistent-return
        return fields
    },
    async hdel(key, field) {
        if (!key || !field) return

        await client.hdel(key, field)
    }
}

module.exports = redisConnect
