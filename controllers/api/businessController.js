const businessService = require('../../services/businessService')

const businessController = {
  getRestaurant (req, res) {
    businessService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = businessController