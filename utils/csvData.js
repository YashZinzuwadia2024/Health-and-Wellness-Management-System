const db = require("../models");

const func = async () => {
    const results = await db.users.findAll({
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
        }],
        raw: true,
        nest: true
    });
    console.log(results);
}
func();