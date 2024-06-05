const { Queue } = require("bullmq");
const redisConfig = require("../config/redisConnection");

const emailQueue = new Queue("emails", {
    connection: redisConfig
});

const reportQueue = new Queue("reports", {
    connection: redisConfig
});

module.exports = { emailQueue, reportQueue };