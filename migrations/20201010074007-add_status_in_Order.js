'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Orders', 'status', {
      type: Sequelize.STRING,
      defaultValue: '未付款'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Orders', 'status')
  }
};
