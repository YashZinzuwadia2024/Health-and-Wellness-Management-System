const { Op } = require("sequelize");
const db = require("../models/index");
const { scheduleDailyMails, scheduleWeeklyMails } = require("./scheduleMails");

module.exports = async () => {
    try {
        let date = new Date();
        let hours = date.getHours() + 5;
        let mins = date.getMinutes() + 30;
        let current_time = `${hours}:${mins}:00`;
        const users = await db.users.findAll({
            attributes: ['id', 'email'],
            include: [{
                model: db.medications,
                as: 'medications',
                attributes: ['medicine_name', 'description'],
                include: [{
                    model: db.medication_details,
                    as: 'details',
                    // where: {
                    //     time: {
                    //         [Op.eq]: current_time
                    //     }
                    // },
                    attributes: {
                        exclude: ['id', 'isDone', 'createdAt', 'updatedAt', 'deletedAt']
                    }
                }]
            }]
        });
        console.log(users);
        users.forEach(user => {
            user.medications.forEach(medication => {
                medication.details.forEach(async record => {
                    if (record.type_id === null && record.end_date === null) {
                        await scheduleDailyMails(user, medication, record);
                    } else {
                        await scheduleWeeklyMails(user, medication, record);
                    }
                });
            });
        });
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
}