const getDay = require("../utils/getDay");
const isLastDay = require("../utils/isLastDay");
const { emailQueue } = require("./producer");
const moment = require("moment");

module.exports = {
    scheduleDailyMails: async (user, medication, record) => {
        if (moment().format("YYYY-MM-DD") === record.start_date) {
            await emailQueue.add("email", {
                user_id: user.id,
                user: user.email,
                medication_id: medication.id,
                medicine_name: medication.medicine_name,
                description: medication.description
            }, {
                removeOnComplete: true,
                removeOnFail: true
            });
            return;
        }
        return;
    },
    scheduleWeeklyMails: async (user, medication, record) => {
        if (moment().format("YYYY-MM-DD") >= record.start_date) {
            const flag = isLastDay(record.end_date);
            if (!flag) {
                if (record.type_id === 1) {
                    await emailQueue.add("email", {
                        user_id: user.id,
                        user: user.email,
                        medicine_name: medication.medicine_name,
                        description: medication.description
                    }, {
                        removeOnComplete: true,
                        removeOnFail: true
                    });
                    return;
                } else {
                    if (moment().weekday() === getDay(record.day)) {
                        await emailQueue.add("email", {
                            user_id: user.id,
                            user: user.email,
                            medicine_name: medication.medicine_name,
                            description: medication.description
                        }, {
                            removeOnComplete: true,
                            removeOnFail: true
                        });
                    }
                    return;
                }
            }
            return;
        }
    }
}




