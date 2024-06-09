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

const sendMail = async (user, medication_details) => {
    try {
        const { medicine_name, description, user_id, medication_id } = medication_details;
        const reminder_record = await db.medication_status.create({
            status: 0,
            user_id: user_id,
            medication_id: medication_id
        });
        await reminder_record.save();
        console.log(reminder_record);
        const mailOptions = {
            from: process.env.TRANSPORTER,
            to: user,
            subject: 'Regular Medication Notification',
            html: `
                <form action="http://localhost:3500/markAsDone?reminder_id=${reminder_record.id}&user_id=${user_id}&medication_id=${medication_id}" method="post">
                    <h2 style="color:rgb(100, 100, 223);text-transform:uppercase; id="medicine_name">It's time to take ${medicine_name}</h2>
                    <h3 style="color:rgb(100, 100, 223);text-transform:uppercase;" id="description">${description}</h3>
                    <input style="background-color: rgb(100, 100, 223);
                        border-radius: 12px;
                        color: #fff;
                        padding: 12px 14px;
                        cursor: pointer;
                        font-weight: 600;
                        text-transform: uppercase;
                        border:none;" type="submit" value="Press once taken" />
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