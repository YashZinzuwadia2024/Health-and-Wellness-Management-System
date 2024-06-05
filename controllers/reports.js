const db = require("../models/index");

module.exports = {
    getReports: async (req, res) => {
        try {
            const { id } = req.session.profile;
            const reports = await db.reports.findAll({
                where: {
                    user_id: id
                },
                attributes: ['id', 'report_path']
            });
            return res.status(200).json(reports);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Somthing went wrong!" });
        }
    }
}