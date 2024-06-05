const isLastDay = require("../utils/isLastDay");
const {emailQueue} = require("./producer");
const cron = require("node-cron");

module.exports = {
    scheduleDailyMails: async (exp, medicine_name, description, end_date) => {
        cron.schedule(exp, async () => {
            const flag = isLastDay(end_date);
            if (!flag) {
                await emailQueue.add("email", {
                    medicine_name: medicine_name,
                    description: description
                }, {
                    removeOnComplete: true,
                    removeOnFail: true
                });
            } else {
                return;
            }
        });
    },
    scheduleWeeklyMails: async (exp, medicine_name, description, end_date) => {
        cron.schedule(exp, async () => {
            const flag = isLastDay(end_date);
            if (!flag) {
                await emailQueue.add("email", {
                    medicine_name: medicine_name,
                    description: description
                }, {
                    removeOnComplete: true,
                    removeOnFail: true
                });
            } else {
                return;
            }
        });
    }
}




