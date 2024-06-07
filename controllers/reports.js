const db = require("../models/index");

module.exports = {
    getReports: async (req, res) => {
        try {
            const { id } = req.user;
            const reports = await db.reports.findAll({
                where: {
                    user_id: id
                },
                attributes: ['report_path', 'report_url'],
                raw: true
            });
            return res.status(200).json(reports);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    }
}