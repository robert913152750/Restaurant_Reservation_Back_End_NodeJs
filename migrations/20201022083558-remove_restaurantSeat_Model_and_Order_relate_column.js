'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RestaurantSeats');
    await queryInterface.removeColumn('Orders', 'RestaurantSeatId')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RestaurantSeats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RestaurantId: {
        type: Sequelize.INTEGER
      },
      seat: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

    queryInterface.addColumn('Orders', 'RestaurantSeatId', {
      type: Sequelize.INTEGER
    })
  }
};
