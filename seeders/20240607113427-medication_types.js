'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert("medication_types", [
      {
        id: 1,
        name: "daily"
      },
      {
        id: 2,
        name: "weekly"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('medication_types', null, {});
  }
};