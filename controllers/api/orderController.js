const { json } = require('sequelize/types')
const orderService = require('../../services/orderService')

const orderController = {
  postOrder: (req, res) => {
    orderService.postOrder((req, res, (data) => {
      return json(data)
    }))
  }
}

module.exports = orderController