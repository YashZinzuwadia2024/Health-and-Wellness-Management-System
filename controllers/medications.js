const db = require("../models/index");
const {emailQueue} = require("../services/producer");
const moment = require("moment");
const { scheduleDailyMails, scheduleWeeklyMails } = require("../services/scheduleMails");
const getDay = require("../utils/getDay");

module.exports = {
    getCountOfMeds: async (req, res) => {
        try {
            const data = await db.medications.findAndCountAll({
                where: {
                    user_id: req.session.profile.id
                }
            });
            return res.status(200).json({ count: data.count });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    },
    getCountOfReports: async (req, res) => {
        try {
            const data = await db.reports.findAndCountAll({
                where: {
                    user_id: req.session.profile.id
                }
            });
            return res.status(200).json({ count: data.count });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    },
    getMedications: async (req, res) => {
        try {
            const user_id = req.session.profile.id;
            let { medications } = await db.users.findOne({
                attributes: {
                    exclude: ['id', 'first_name', 'last_name', 'email', 'password', 'createdAt', 'updatedAt', 'deletedAt']
                },
                where: {
                    id: user_id
                },
                include: [{
                    model: db.medications,
                    as: 'medications',
                    attributes: {
                        exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id', 'medication_details_id']
                    },
                    include: [{
                        model: db.medication_details,
                        as: 'details',
                        attributes: {
                            exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'type_id']
                        },
                        include: [{
                            model: db.medication_types,
                            attributes: ['name']
                        }]
                    }]
                }]
            });
            return res.status(200).json(medications);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    },
    addMedication: async (req, res) => {
        try {
            const now = moment();
            const { type,
                medicine_name,
                description,
                start_date,
                end_date,
                time,
                day,
                isDone
            } = req.body;
            if (type === 'One Time') {
                const new_medication_details = await db.medication_details.create({
                    start_date: start_date,
                    time: time
                });
                const { id } = new_medication_details;
                const new_medication = await db.medications.create({
                    medicine_name: medicine_name,
                    description: description,
                    user_id: req.session.profile.id,
                    medication_details_id: id
                });
                const specific_time = moment(`${new_medication_details.start_date} ${new_medication_details.time}`)
                await emailQueue.add("email", {
                    user_id: req.session.profile.id,
                    medication_id: new_medication.id,
                    medicine_name: medicine_name,
                    description: description
                }, {
                    delay: specific_time - now,
                    removeOnComplete: true,
                    removeOnFail: true
                });
                return res.status(200).json({ new_medication: new_medication, success: true });
            } else if (type === 'Recurring') {
                if (day == '') {
                    const { id } = await db.medication_types.findOne({
                        where: {
                            name: 'daily'
                        }
                    });
                    const new_medication_details = await db.medication_details.create({
                        start_date: start_date,
                        end_date: end_date,
                        time: time,
                        type_id: id
                    });
                    const new_medication_id = new_medication_details.id;
                    const new_medication = await db.medications.create({
                        medicine_name: medicine_name,
                        description: description,
                        user_id: req.session.profile.id,
                        medication_details_id: new_medication_id
                    });
                    const minutes = new_medication_details.time.split(":")[1];
                    const hours = new_medication_details.time.split(":")[0];
                    console.log("mins: ",minutes);
                    console.log("hours: ", hours);
                    await scheduleDailyMails(`${minutes} ${hours} * * *`, medicine_name, description, new_medication_details.end_date);
                    return res.status(200).json({ new_medication: new_medication, success: true });
                } else {
                    const { id } = await db.medication_types.findOne({
                        attributes: ['id'],
                        where: {
                            name: 'weekly'
                        }
                    });
                    const new_medication_details = await db.medication_details.create({
                        start_date: start_date,
                        end_date: end_date,
                        time: time,
                        day: day,
                        type_id: id
                    });
                    const new_medication_id = new_medication_details.id;
                    const newMedication = await db.medications.create({
                        medicine_name: medicine_name,
                        description: description,
                        user_id: req.session.profile.id,
                        medication_details_id: new_medication_id
                    });
                    const minutes = new Date(new_medication_details.start_date).getMinutes();
                    const hours = new Date(new_medication_details.start_date).getHours();
                    const specific_day = getDay(day.toLowerCase());
                    await scheduleWeeklyMails(`${minutes} ${hours} * * ${specific_day}`, medicine_name, description, new_medication_details.end_date);
                    return res.status(200).json({ new_medication: newMedication, success: true });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    }
}