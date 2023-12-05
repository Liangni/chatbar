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
  }
};

module.exports = redisConnect;
