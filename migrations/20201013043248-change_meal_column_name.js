'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Meals', 'note', 'description')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Meals', 'description', 'note')
  }
};
