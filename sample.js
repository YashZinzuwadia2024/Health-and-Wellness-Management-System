const { Op } = require('sequelize');
const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the start of the week (Sunday)
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to the end of the week (Saturday)

const report = await users.findAll({
  attributes: ['id', 'first_name', 'last_name', 'email'],
  include: [
    {
      model: medications,
      attributes: ['medicine_name', 'description'],
      include: [
        {
          model: medication_status,
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
