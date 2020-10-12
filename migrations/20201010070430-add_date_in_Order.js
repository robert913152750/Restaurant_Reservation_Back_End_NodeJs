'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('orders', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('orders', 'date')
  }
};
