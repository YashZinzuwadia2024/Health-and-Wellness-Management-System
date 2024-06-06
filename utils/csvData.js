const db = require("../models");

const func = async () => {
    const results = await db.medication_status.findAll({
        attributes: ['user_id', 'medication_id', 'notification_date','status'],
        include: [
            {
                model: db.medications,
                attributes: [['medicine_name', 'medicine'], 'description'],
            },
            {
                model: db.users,
                attributes: ['first_name','last_name']
            }
        ],
        raw: true,
        nest: true
    });
}
func();