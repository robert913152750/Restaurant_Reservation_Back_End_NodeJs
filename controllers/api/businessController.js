const businessService = require('../../services/businessService')

const businessController = {
  getRestaurant (req, res) {
    businessService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  getMenu (req, res) {
    businessService.getMenu(req, res, (data) => {
      return res.json(data)
    })
  },
  putRestaurant (req, res) {
    businessService.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  putMenu (req, res) {
    businessService.putMenu(req, res, (data) => {
      return res.json(data)
    })
  },
  postMeal (req, res) {
    businessService.postMeal(req, res, (data) => {
      return res.json(data)
    })
  },
  patchIsSale (req, res) {
    businessService.patchIsSale(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = businessController