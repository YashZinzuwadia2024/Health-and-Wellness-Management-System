const db = require("../models/index");
const emailQueue = require("../services/producer");
const cron = require("node-cron");

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
                console.log(id);
                const new_medication = await db.medications.create({
                    medicine_name: medicine_name,
                    description: description,
                    user_id: req.session.profile.id,
                    medication_details_id: id
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
                    return res.status(200).json({ new_medication: new_medication, success: true });
                } else {
                    const { id } = await db.medication_types.findOne({
                        attributes: ['id'],
                        where: {
                            name: 'weekly'
                        }
                    });
                    console.log(id);
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
                    return res.status(200).json({ new_medication: newMedication, success: true });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    }
}