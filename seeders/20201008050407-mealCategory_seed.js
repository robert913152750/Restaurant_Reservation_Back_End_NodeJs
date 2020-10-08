'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      '主食',
      '飲料',
      '甜點',
      '湯品',
      '副食',
      '沙拉',
    ]

    const restaurantCont = 50

    await queryInterface.bulkInsert(
      'MealCategories',
      Array.from({ length: 50 }).map((_, index) => ({
        RestaurantId: (index % restaurantCont) + 1,
        name: categories[0],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    await queryInterface.bulkInsert(
      'MealCategories',
      Array.from({ length: 50 }).map((_, index) => ({
        RestaurantId: (index % restaurantCont) + 1,
        name: categories[1],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    await queryInterface.bulkInsert(
      'MealCategories',
      Array.from({ length: 50 }).map((_, index) => ({
        RestaurantId: (index % restaurantCont) + 1,
        name: categories[2],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    await queryInterface.bulkInsert(
      'MealCategories',
      Array.from({ length: 50 }).map((_, index) => ({
        RestaurantId: (index % restaurantCont) + 1,
        name: categories[3],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    await queryInterface.bulkInsert(
      'MealCategories',
      Array.from({ length: 50 }).map((_, index) => ({
        RestaurantId: (index % restaurantCont) + 1,
        name: categories[4],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

    await queryInterface.bulkInsert(
      'MealCategories',
      Array.from({ length: 50 }).map((_, index) => ({
        RestaurantId: (index % restaurantCont) + 1,
        name: categories[5],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('MealCategories', null, {})
  }
};
