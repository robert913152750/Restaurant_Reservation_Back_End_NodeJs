const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const City = db.City

const restService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      include: [
        { model: Category },
        { model: City }
      ]
    }).then(restaurants => {
      callback({ restaurants: restaurants })
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
  }






}

module.exports = restService