const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER,
        pass: process.env.TRANSPORTER_PASS
    }
});

const sendMail = (user, reportPath, reportName) => {
    try {
        const mailOptions = {
            from: process.env.TRANSPORTER,
            to: user,
            subject: 'Weekly Medication Report',
            attachments: [
                {
                    filename: reportName,
                    path: reportPath
                }
            ]
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;