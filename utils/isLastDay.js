const moment = require("moment");   

module.exports = (end_date) => {
    const current_day = moment().format("YYYY-MM-DD");
    if (current_day > end_date) {
        return true;
    } else {
        return false;
    }
}