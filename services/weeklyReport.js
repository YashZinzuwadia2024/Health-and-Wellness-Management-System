const cron = require("node-cron");
const getData = require("../utils/getData");
const { reportQueue } = require("./producer");

const data = await getData();

cron.schedule("0 18 * * 6", async () => {
    reportQueue.add("report", {
        data: data
    }, {
        removeOnComplete: true,
        removeOnFail: true
    });
})
