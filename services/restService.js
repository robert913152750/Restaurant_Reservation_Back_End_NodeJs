// const db = require('../models')

const restService = {
  getRestaurants: (req, res, callback) => {
    callback({
      '1': 'Hello',
      '2': 'world'
    })
  }
}

module.exports = restService