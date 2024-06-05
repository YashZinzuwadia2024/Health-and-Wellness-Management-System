const { Worker } = require("bullmq");
const sendMail = require("./mailer");
const redisConnection = require("../config/redisConnection");
const generateCsv = require("../utils/generateCsv");

const emailWorker = new Worker("emails", async job => {
    sendMail("yash.zinzuwadia.2024@gmail.com", job.data);
}, {
    connection: redisConnection
});

const reportWorker = new Worker("reports", async job => {
    const { data } = job.data;
    generateCsv(data);
}, {
    connection: redisConnection
});

module.exports = { emailWorker, reportWorker };