const { createObjectCsvWriter } = require('csv-writer');
const moment = require('moment');
const fs = require("fs");
const path = require("path");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const db = require('../models');
const reportSender = require("./reportSender");

module.exports = async (data) => {
    try {
        data.forEach(async user => {
            const fileName = `${user.first_name}_${Date.now()}_Medication-Report.csv`;
            const filePath = path.join(__dirname, "../public", "reports",`${fileName}`);
            fs.open(filePath, "w", (err, file) => {
                if (err) throw err;
                console.log("File Created");
            })
            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'medicine_name', title: 'Medicine' },
                    { id: 'description', title: 'Description' },
                    { id: 'status', title: 'Status' },
                    { id: 'notification_date', title: 'Date' }
                ]
            });
            const records = [];
            user.medications.forEach(medication => {
                medication.medication_statuses.forEach(status => {
                    records.push({
                        medicine_name: medication.medicine_name,
                        description: medication.description,
                        status: (status.status === 0) ? 'Taken' : 'Missed',
                        notification_date: moment(status.notification_date).format("YYYY-MM-DD")
                    });
                });
            });
            await csvWriter.writeRecords(records);
            const upload_results = await uploadToCloudinary(filePath, { resource_type: 'raw', folder: 'reports' });
            const new_report = await db.reports.create({
                report_path: upload_results.url,
                user_id: user.id
            });
            await new_report.save();
            reportSender(user.email, filePath, fileName);
        });
        return;
    } catch (error) {
        console.log("generate error: ",error);
        return error;
    }
}   