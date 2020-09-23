'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      RestaurantSeatsId: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.STRING
      },
      peopleCount: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.STRING
      },
      reserve_name: {
        type: Sequelize.STRING
      },
      reserve_phone: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  }
};