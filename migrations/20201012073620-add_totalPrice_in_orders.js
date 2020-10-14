'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'totalPrice', {
      type: Sequelize.INTEGER

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'totalPrice')
  }
};
