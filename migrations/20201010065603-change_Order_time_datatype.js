'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('orders', 'time', {
      type: Sequelize.DATE,
      allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('orders', 'time', {
      type: Sequelize.STRING
    })
  }
};
