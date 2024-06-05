const { Worker } = require("bullmq");
const sendMail = require("./mailer");
const redisConnection = require("../config/redisConnection");

const worker = new Worker("emails", async job => {
    sendMail("yash.zinzuwadia.2024@gmail.com", job.data);
}, {
    connection: redisConnection
})

module.exports = worker;