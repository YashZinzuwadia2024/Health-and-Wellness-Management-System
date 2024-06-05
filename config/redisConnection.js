const Redis = require("ioredis");
require("dotenv").config();

const redisConfig = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
}

module.exports = redisConfig;