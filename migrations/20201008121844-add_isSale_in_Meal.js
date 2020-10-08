'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Meals', 'isSale', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Meals', 'isSale')
  }
};
