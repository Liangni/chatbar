/* eslint-disable import/no-extraneous-dependencies */
const { createClient } = require('redis');

let client;
const redisConnect = {
  init({ password, host, port }) {
    client = createClient({
      password,
      socket: { host, port }
    });
    client.on('error', (err) => console.error('Redis Client Error', err));
    client.connect();
  },
  async get(key) {
    if (!key) return null;
    const val = await client.get(key);
    return val;
  },
  // eslint-disable-next-line default-param-last
  async set(key, value = '1', options = {}) {
    if (!value) return;

    let { cacheTime } = options;
    cacheTime = cacheTime || 60 * 60 * 10;

    await client.set(key, value, { EX: cacheTime });
  },
  async hget(key, field) {
    if (!key || !field) return null;
    const val = await client.hGet(key, field);
    return val;
  },
  async hset(key, field, val) {
    if (!key || !field) return;

    await client.hSet(key, field, val);
  },
  async hgetall(key) {
    if (!key) return;

    const result = await client.hGetAll(key);
    // eslint-disable-next-line consistent-return
    return result;
  },
  async hdel(key, field) {
    if (!key || !field) return;

    await client.hDel(key, field);
  }
};

module.exports = redisConnect;
