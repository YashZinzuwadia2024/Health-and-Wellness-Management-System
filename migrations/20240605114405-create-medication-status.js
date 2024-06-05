const moment = require("moment");

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medication_statuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      notification_date: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: moment().format("YYYY-MM-DD")
      },
      status: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT
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
    await queryInterface.addColumn("medication_statuses", "user_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });
    await queryInterface.addColumn("medication_statuses", "medication_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "medications",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medication_statuses');
  }
};