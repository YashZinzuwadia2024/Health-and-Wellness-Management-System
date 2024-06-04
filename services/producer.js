const { Queue } = require("bullmq");
const redisConnection = require("../config/redisConnection");

const emailQueue = new Queue("emails", {
    connection: redisConnection
});

module.exports = emailQueue;