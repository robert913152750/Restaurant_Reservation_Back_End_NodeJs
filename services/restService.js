const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const City = db.City
const pageLimit = 12

const restService = {
  getRestaurants: (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    let cityId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }

    if (req.query.cityId) {
      cityId = Number(req.query.cityId)
      whereQuery['cityId'] = cityId
    }

    Restaurant.findAndCountAll({
      include: [
        Category,
        City
      ],
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(restaurants => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(restaurants.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)

      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      const data = restaurants.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        cityName: r.dataValues.City.name
      }))

      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        City.findAll({
          raw: true,
          nest: true
        }).then(cities => {
          return callback({
            restaurants: restaurants,
            categories: categories,
            cities: cities,
            categoryId: categoryId,
            cityId: cityId,
            page: page,
            totalPage: totalPage,
            prev: prev,
            next: next
          })
        })
      })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: City }
      ]
    }).then(restaurant => {
      callback({ restaurant: restaurant })
    })
  },







}

module.exports = restService