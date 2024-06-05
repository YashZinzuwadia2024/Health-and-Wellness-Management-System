const { Queue } = require("bullmq");
const redisConfig = require("../config/redisConnection");

const emailQueue = new Queue("emails", {
    connection: redisConfig
});

module.exports = emailQueue;