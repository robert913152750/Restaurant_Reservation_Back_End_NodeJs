// const db = require('../../models')
const restService = require('../../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  getMeals: (req, res) => {
    restService.getMeals(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = restController