'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medication_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      day: {
        type: Sequelize.STRING
      },
      isDone: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(`CURRENT_TIMESTAMP`)
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
    await queryInterface.addColumn("medication_details", "type_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "medication_types",
        key: "id"
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medication_details');
  }
};