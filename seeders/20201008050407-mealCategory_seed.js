'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      '主食',
      '飲料',
      '甜點',
      '湯品',
      '副食',
      '沙拉'
    ]

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
