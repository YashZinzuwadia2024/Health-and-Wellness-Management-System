const db = require("../models/index");
const { Op } = require("sequelize");

module.exports = async () => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        const results = await db.users.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email'],
            include: [
                {
                    model: db.medications,
                    attributes: ['medicine_name', 'description'],
                    include: [
                        {
                            model: db.medication_status,
                            attributes: ['status', 'notification_date'],
                            where: {
                                notification_date: {
                                    [Op.between]: [startOfWeek, endOfWeek]
                                }
                            }
                        }
                    ]
                }
            ]
        });
        return results; 
    } catch (error) {
        console.log(error);
        return error;
    }
}