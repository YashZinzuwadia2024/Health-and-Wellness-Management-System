const cron = require("node-cron");
const { reportQueue } = require("./producer");
const fetchData = require("../utils/fetchData");

cron.schedule("0 6 * * 6", async () => {
    const data = await fetchData();
    reportQueue.add("report", {
        data: data
    }, {
        removeOnComplete: true,
        removeOnFail: true
    });
});
