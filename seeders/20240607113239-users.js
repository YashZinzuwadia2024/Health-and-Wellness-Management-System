'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        first_name: "Yash",
        last_name: "Zinzuwadia",
        email: "yash@zinzu.com",
        password: "$2b$12$78Qed2GV9DQeMH4CYlXYyefsl0aR66h/IShe53ll3/e56DwSxLF1i" // yash
      },
      {
        first_name: "test",
        last_name: "test",
        email: "test@gmail.com",
        password: "$2b$12$WjdaudmdJBW0deAB4UUA/eak/vXSlB44nRLiIkDL4AJLKC.09WtEu" // test
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};

