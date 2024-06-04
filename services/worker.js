const { Worker } = require("bullmq");
const sendMail = require("./mailer");

const worker = new Worker("emails", async job => {
    
})