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

    const restaurantCont = 50

    await queryInterface.bulkInsert(
      'MealCategories',
      Array.from({ length: 300 }).map((_, index) => ({
        RestaurantId: (index % restaurantCont) + 1,
        name: categories[(index % restaurantCont) % 6],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('MealCategories', null, {})
  }
};
