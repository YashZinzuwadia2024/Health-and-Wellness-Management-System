const csvData = require("./csvData");

module.exports = (data) => {
    try {
        const finalData = csvData(data);
    } catch (error) {
        console.log(error);
        return error;
    }
}   