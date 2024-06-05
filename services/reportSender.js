const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER,
        pass: process.env.TRANSPORTER_PASS
    }
});

const sendMail = (user, data) => {
    try {
        const mailOptions = {
            from: process.env.TRANSPORTER,
            to: user,
            subject: 'Weekly Medication Report',
            html: `
                <form action="http://localhost:3500/markAsDone" method="post">
                    <h3 id="medicine_name">It's time to take ${medicine_name}</h3>
                    <p id="description">${description}</p>
                    <label for="markAsDone">Confirm Once!!</label>
                    <input type="checkbox" name="markAsDone" id="markAsDone">
                    <input type="submit" value="Submit">
                </form>
            `
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