'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const category = [
      '日本料理',
      '中華料理',
      '義大利料理',
      '小吃'
    ]

    const city = [
      ['台北市', '內湖區'],
      ['台北市', '士林區'],
      ['台北市', '北投區'],
      ['台北市', '東區'],
      ['台北市', '信義區'],
      ['台北市', '大安區'],

    ]

    const price = [
      '$',
      '$$',
      '$$$'
    ]
    await queryInterface.bulkInsert('Users', [{
      name: 'user1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      phone: '0919566248',
      role: 'common',
      avatar: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user2',
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      phone: '0919599647',
      role: 'common',
      avatar: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user3',
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      phone: '0919744123',
      role: 'business',
      avatar: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user4',
      email: 'user4@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      phone: '0948524123',
      role: 'business',
      avatar: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    await queryInterface.bulkInsert(
      'Categories',
      Array.from({ length: 4 }).map((_, index) => ({
        name: category[index],
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}
    )

    await queryInterface.bulkInsert(
      'Cities',
      Array.from({ length: 6 }).map((_, index) => ({
        name: city[index][0],
        area: city[index][1],
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}
    )

    await queryInterface.bulkInsert(
      'Restaurants',
      Array.from({ length: 48 }).map((_, index) => ({
        CategoryId: Math.floor(Math.random() * 4 + 1),
        CityId: Math.floor(Math.random() * 6 + 1),
        name: faker.name.findName(),
        description: faker.lorem.text(),
        address: faker.address.streetAddress(),
        image: faker.image.imageUrl(),
        price: price[Math.floor(Math.random() * 2)],
        maximum_seat: Math.floor(Math.random() * 30 + 10),
        open_time: '12:00 ~ 21:00',
        phone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}
    )

    await queryInterface.bulkInsert(
      'Restaurants',
      [{
        UserId: 3,
        CategoryId: Math.floor(Math.random() * 4 + 1),
        CityId: Math.floor(Math.random() * 6 + 1),
        name: faker.name.findName(),
        description: faker.lorem.text(),
        address: faker.address.streetAddress(),
        image: faker.image.imageUrl(),
        price: price[Math.floor(Math.random() * 2)],
        maximum_seat: Math.floor(Math.random() * 30 + 10),
        open_time: '12:00 ~ 21:00',
        phone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        UserId: 4,
        CategoryId: Math.floor(Math.random() * 4 + 1),
        CityId: Math.floor(Math.random() * 6 + 1),
        name: faker.name.findName(),
        description: faker.lorem.text(),
        address: faker.address.streetAddress(),
        image: faker.image.imageUrl(),
        price: price[Math.floor(Math.random() * 2)],
        maximum_seat: Math.floor(Math.random() * 30 + 10),
        open_time: '12:00 ~ 21:00',
        phone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date()
      }]
    )

    await queryInterface.bulkInsert(
      'Meals',
      Array.from({ length: 200 }).map((_, index) => ({
        RestaurantId: Math.floor(Math.random() * 50 + 1),
        name: faker.name.findName(),
        price: Math.floor(Math.random() * 240 + 60),
        image: faker.image.food(),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {}
    )

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Categories', null, {})
    await queryInterface.bulkDelete('Cities', null, {})
    await queryInterface.bulkDelete('Restaurants', null, {})
    await queryInterface.bulkDelete('Meals', null, {})
  }
};
