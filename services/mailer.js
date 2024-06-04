const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER,
        pass: process.env.TRANSPORTER_PASS
    }
});

const sendMail = (user, medication_details) => {
    try {
        const mailOptions = {
            from: 'youremail@gmail.com',
            to: user,
            subject: 'Sending Email using Node.js',
            html: `
                <form action="http://localhost:3500/markAsDone" method="post">
                    <h3 id="medicine_name"></h3>
                    <p id="description"></p>
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