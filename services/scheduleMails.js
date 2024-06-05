const emailQueue = require("./producer");
const cron = require("node-cron");

module.exports = {
    scheduleDailyMails: async (exp, end_date) => {
        const task = cron.schedule(exp, async () => {
            if (!isLastDay()) {
                await emailQueue.add("email", {
                    medicine_name: medicine_name,
                    description: description
                }, {
                    removeOnComplete: true,
                    removeOnFail: true
                });
            } else {
                task.stop();
            }
            const isLastDay = () => {
                const current_day = moment().format("YYYY-MM-DD");
                if (current_day > end_date) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    },
    scheduleWeeklyMails: async (exp, end_date) => {
        const task = cron.schedule(exp, async () => {
            if (!isLastDay()) {
                await emailQueue.add("email", {
                    medicine_name: medicine_name,
                    description: description
                }, {
                    removeOnComplete: true,
                    removeOnFail: true
                });
            } else {
                task.stop();
            }
            const isLastDay = () => {
                const current_day = moment().format("YYYY-MM-DD");
                if (current_day > end_date) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    }
}




