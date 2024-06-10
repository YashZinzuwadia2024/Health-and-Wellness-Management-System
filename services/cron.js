const { Op } = require("sequelize");
const db = require("../models/index");
const { scheduleDailyMails, scheduleWeeklyMails } = require("./scheduleMails");

module.exports = async () => {
    try {
        let today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let current_time = `${h}:${m}:00`;
        const users = await db.users.findAll({
            attributes: ['id', 'email'],
            include: [{
                model: db.medications,
                as: 'medications',
                attributes: ['medicine_name', 'description'],
                include: [{
                    model: db.medication_details,
                    as: 'details',
                    where: {
                        time: {
                            [Op.eq]: current_time
                        }
                    },
                    attributes: {
                        exclude: ['id', 'isDone', 'createdAt', 'updatedAt', 'deletedAt']
                    }
                }]
            }]
        });
        users.forEach(user => {
            user.medications.forEach(async medication => {
                if (medication.details.type_id === null && medication.details.end_date === null) {
                    await scheduleDailyMails(user, medication, medication.details);
                } else {
                    await scheduleWeeklyMails(user, medication, medication.details);
                }
            });
        });
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
}