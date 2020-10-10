'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'RestaurantSeats',
      Array.from({ length: 50 }).map((_, index) => ({
        RestaurantId: index + 1,
        seat: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RestaurantSeats', null, {})
  }
};
