const { json } = require('sequelize/types')
const orderService = require('../../services/orderService')

const orderController = {
  postOrder: (req, res) => {
    orderService.postOrder((req, res, (data) => {
      return json(data)
    }))
  },
  cancelOrder: (req, res) => {
    orderService.cancelOrder((req, res, (data) => {
      return json(data)
    }))
  },
  getPayment: (req, res) => {
    orderService.getPayment((req, res, (data) => {
      return json(data)
    }))
  }
}

module.exports = orderController