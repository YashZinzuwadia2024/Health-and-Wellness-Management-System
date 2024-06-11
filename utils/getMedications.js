const db = require("../models/index");

module.exports = async (id) => {
    try {
        let { medications } = await db.users.findOne({
            attributes: {
                exclude: ['id', 'first_name', 'last_name', 'email', 'password', 'createdAt', 'updatedAt', 'deletedAt']
            },
            where: {
                id: id
            },
            include: [{
                model: db.medications,
                as: 'medications',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt', 'user_id']
                },
                include: [{
                    model: db.medication_details,
                    as: 'details',
                    attributes: {
                        exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'type_id']
                    },
                    include: [{
                        model: db.medication_types,
                        attributes: ['name']
                    }]
                }]
            }]
        });
        return medications;
    } catch (error) {
        throw error;
    }
}