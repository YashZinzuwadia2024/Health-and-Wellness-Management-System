const db = require("../models/index");

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
            const { medications } = await db.users.findOne({
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
                        exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id','medication_details_id']
                    },
                    include: [{
                        model: db.medication_details,
                        as: 'details',
                        attributes: {
                            exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt']
                        }
                    }]
                }]
            });
            let updatedMedications = medications.map(medication => {
                let { details } = medication;
                delete medication.details;
                medication.start_date = details.start_date;
                medication.end_date = details.end_date;
                medication.time = details.time;
                medication.day = details.day;
                medication.isDone = details.isDone;
            });
            // console.log(updatedMedications);
            // return res.json(medications);
            return res.status(200).json(updatedMedications);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    }
}