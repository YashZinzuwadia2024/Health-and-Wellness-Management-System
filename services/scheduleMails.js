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
        console.log(exp);
        cron.schedule(exp, async () => {
            console.log("hellowwwww");
            const flag = isLastDay(end_date);
            if (!flag) {
                console.log("Ready");
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




