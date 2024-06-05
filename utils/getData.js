const db = require("../models");

module.exports = async () => {
    try {
        const data = await db.users.findAll({
            attributes: ['id'],
            include: [{
                model: db.medications,
                as: 'medications',
                attributes: ['medicine_name', 'description'],
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
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}