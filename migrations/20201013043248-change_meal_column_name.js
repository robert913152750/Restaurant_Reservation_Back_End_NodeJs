'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('meals', 'note', 'description')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('meals', 'description', 'note')
  }
};
