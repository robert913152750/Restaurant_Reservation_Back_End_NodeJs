'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 200 }).map(r => ({
        UserId: Math.floor(Math.random() * 2 + 1),
        RestaurantId: Math.floor(Math.random() * 50 + 1),
        content: faker.lorem.sentences(),
        rating: Math.floor(Math.random() * 5 + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
