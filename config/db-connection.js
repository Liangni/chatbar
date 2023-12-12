require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'chatbar_workspace',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    // use_env_variable: 'PROD_MYSQL_URL',
    username: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'chatbar_workspace',
    host: 'db',
    port: '3306',
    dialect: 'mysql',
    logging: false
  }
};
