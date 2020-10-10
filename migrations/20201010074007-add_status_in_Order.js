'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('orders', 'status', {
      type: Sequelize.STRING,
      defaultValue: '未付款'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('orders', 'status')
  }
};
