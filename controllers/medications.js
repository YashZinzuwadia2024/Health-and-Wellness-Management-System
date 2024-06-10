const db = require("../models/index");

module.exports = {
    getCountOfMeds: async (req, res) => {
        try {
            const data = await db.medications.findAndCountAll({
                where: {
                    user_id: req.user.id
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
                    user_id: req.user.id
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
            const user_id = req.user.id;
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
                        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'user_id']
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
    getMedication: async (req, res) => {
        try {
            const { id } = req.params;
            const medication = await db.medications.findOne({
                where: {
                    id: id
                },
                attributes: ['medicine_name', 'description'],
                include: [{
                    model: db.medication_details,
                    as: 'details',
                    attributes: ['start_date', 'end_date', 'time', 'day', 'type_id']
                }]
            });
            return res.status(200).json(medication);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Somthing went wrong!" });
        }
    },
    updateMedication: async (req, res) => {
        try {
            const id = req.params;
            const { type,
                medicine_name,
                description,
                start_date,
                end_date,
                time,
                day,
                isDone
            } = req.body;
            const medication = await db.medications.findOne({
                where: {
                    id: id
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                }
            });
            medication.medicine_name = medicine_name;
            medication.description = description;
            if (type === 'One Time') {
                const medication_details = await db.medication_details.findOne({
                    where: {
                        id: medication.medication_details_id
                    }
                });
                medication_details.start_date = start_date;
                medication_details.time = time;
                await medication.save();
                await medication_details.save();
                return res.status(200).josn({ success: true, message: "Medication Updated!" });
            } else if (type === 'Recurring') {
                if (day == '') {
                    const { id } = await db.medication_types.findOne({
                        where: {
                            name: 'daily'
                        },
                        raw: true
                    });
                    const medication_details = await db.medication_details.findOne({
                        where: {
                            id: medication.medication_details_id
                        }
                    });
                    medication_details.start_date = start_date;
                    medication_details.end_date = end_date;
                    medication_details.time = time;
                    medication_details.type_id = id;
                    await medication.save();
                    await medication_details.save();
                    return res.status(200).josn({ success: true, message: "Medication Updated!" });
                } else {
                    const { id } = await db.medication_types.findOne({
                        attributes: ['id'],
                        where: {
                            name: 'weekly'
                        },
                        raw: true
                    });
                    const medication_details = await db.medication_details.findOne({
                        where: {
                            id: medication.medication_details_id
                        }
                    });
                    medication_details.start_date = start_date;
                    medication_details.end_date = end_date;
                    medication_details.time = time;
                    medication_details.day = day;
                    medication_details.type_id = id;
                    await medication.save();
                    await medication_details.save();
                    return res.status(200).josn({ success: true, message: "Medication Updated!" });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Somthing went wrong!" });
        }
    },
    deleteMedication: async (req, res) => {
        try {
            const { medication_id, medication_details_id } = req.body;
            await db.medications.destroy({
                where: {
                    id: medication_id
                }
            });
            await db.medication_details.destroy({
                where: {
                    id: medication_details_id
                }
            });
            return res.status(200).json({ success: true });
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
                await new_medication_details.save();
                const { id } = new_medication_details;
                const new_medication = await db.medications.create({
                    medicine_name: medicine_name,
                    description: description,
                    user_id: req.user.id,
                    medication_details_id: id
                });
                await new_medication.save();
                return res.status(200).json({ new_medication: new_medication, success: true });
            } else if (type === 'Recurring') {
                if (day == '') {
                    const { id } = await db.medication_types.findOne({
                        where: {
                            name: 'daily'
                        },
                        raw: true
                    });
                    const new_medication_details = await db.medication_details.create({
                        start_date: start_date,
                        end_date: end_date,
                        time: time,
                        type_id: id
                    });
                    await new_medication_details.save();
                    const new_medication_id = new_medication_details.id;
                    const new_medication = await db.medications.create({
                        medicine_name: medicine_name,
                        description: description,
                        user_id: req.user.id,
                        medication_details_id: new_medication_id
                    });
                    await new_medication.save();
                    return res.status(200).json({ new_medication: new_medication, success: true });
                } else {
                    const { id } = await db.medication_types.findOne({
                        attributes: ['id'],
                        where: {
                            name: 'weekly'
                        },
                        raw: true
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
                        user_id: req.user.id,
                        medication_details_id: new_medication_id
                    });
                    return res.status(200).json({ new_medication: newMedication, success: true });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    },
    markAsDone: async (req, res) => {
        try {
            const { user_id, medication_id, reminder_id } = req.query;
            const reminder_record = await db.medication_status.findOne({
                where: {
                    id: reminder_id
                }
            });
            reminder_record.status = 1;
            await reminder_record.save();
            const medication = await db.medications.findOne({
                where: {
                    id: medication_id
                },
                raw: true
            });
            return res.render("acknowledgePage", {
                medicine: medication.medicine_name
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    }
}