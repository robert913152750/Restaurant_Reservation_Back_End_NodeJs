'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Meals', 'mealCategoryId', 'MealCategoryId')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Meals', 'MealCategoryId', 'mealCategoryId')
  }
};
