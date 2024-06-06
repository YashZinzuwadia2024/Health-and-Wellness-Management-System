const { Worker } = require("bullmq");
const sendMail = require("./mailer");
const redisConnection = require("../config/redisConnection");
const generateCsv = require("../utils/generateCsv");

const emailWorker = new Worker("emails", async job => {
    sendMail(job.data.user, job.data);
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