const nodemailer = require('nodemailer');
require("dotenv").config();
const db = require("../models/index");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER,
        pass: process.env.TRANSPORTER_PASS
    }
});

const sendMail = (user, medication_details) => {
    try {
        const { medicine_name, description, user_id, medication_id } = medication_details;
        const mailOptions = {
            from: process.env.TRANSPORTER,
            to: user,
            subject: 'Regular Medication Notification',
            html: `
                <form action="http://localhost:3500/markAsDone?user_id=${user_id}&medication_id=${medication_id}" method="post">
                    <h3 id="medicine_name">It's time to take ${medicine_name}</h3>
                    <p id="description">${description}</p>
                    <label for="markAsDone">Confirm Once!!</label>
                    <input type="checkbox" name="markAsDone" id="markAsDone">
                    <input type="submit" value="Submit">
                </form>
            `
        };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
            } else {
                await db.medication_status.create({
                    status: 0,
                    user_id: user_id,
                    medication_id: medication_id
                })
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;