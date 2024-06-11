const db = require("../models/index");

module.exports = async (id) => {
    try {
        const medication = await db.medications.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt', 'user_id']
            },
            include: [{
                model: db.medication_details,
                as: 'details',
                attributes: ['start_date', 'end_date', 'time', 'day', 'type_id']
            }]
        });
        return medication;
    } catch (error) {
        throw error;
    }
}