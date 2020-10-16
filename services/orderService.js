const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Meal = db.Meal
const MealCategory = db.MealCategory
const RestaurantSeat = db.RestaurantSeat
const Order = db.Order
const OrderItem = db.OrderItem
const Payment = db.Payment
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const moment = require('moment')
const payment = require('../config/payment')


const orderService = {
  async postOrder (req, res, callback) {
    if (!req.body.info.seat || !req.body.info.time || !req.body.info.name || !req.body.info.phone || !req.body.info.date || !req.body.info.totalPrice) {
      return callback({ status: 'error', message: '所有欄位為必填' })
    }
    const { time, name, phone, date, note, totalPrice } = req.body.info
    const seatCount = req.body.info.seat

    RestaurantSeat.findOne({
      where: { RestaurantId: req.params.id }
    }).then((seat) => {
      Order.create({
        UserId: Number(req.user.dataValues.id),
        RestaurantSeatId: Number(seat.dataValues.id),
        time: time.toString(),
        peopleCount: seatCount,
        note: note,
        reserve_name: name,
        reserve_phone: phone,
        date: date.toString(),
        totalPrice: Number(totalPrice)
      }).then((order) => {
        let meals = req.body.orders
        OrderItem.bulkCreate(
          Array.from({ length: meals.length }).map((_, index) => ({
            MealId: Number(meals[index].id),
            OrderId: Number(order.dataValues.id),
            quantity: Number(meals[index].quantity)
          }))
        ).then((bulk) => {
          let restSeat = seat.seat - order.peopleCount
          seat.update({
            seat: restSeat
          }).then(() => {
            return callback({
              status: 'success',
              message: '訂位&訂餐成功',
              order: order
            })
          })
        })

      })
    })
      .catch(err => res.send(err))
  },
  async cancelOrder (req, res, callback) {
    const order = await Order.findByPk(req.params.id)
    await order.update({
      status: '取消訂單'
    })

    callback({
      status: 'success',
      message: '訂單取消成功',
      order: order
    })
  },
  async getPayment (req, res, callback) {
    const order = await Order.findByPk(req.params.id)
    const user = await User.findByPk(req.user.dataValues.id)
    const userEmail = user.email
    console.log('=========')
    const tradeInfo = payment.getTradeInfo(order.totalPrice, '餐廳訂單', userEmail)
    return callback({ payment: { order, tradeInfo } })
  },
  async spgatewayCallback (req, res, callback) {
    console.log('===== spgatewayCallback =====')
    console.log(req.body)
    console.log('==========')
    const data = JSON.parse(payment.create_mpg_aes_decrypt(req.body.TradeInfo))
    console.log(data)



    callback({
      status: 'success',
      message: '交易成功'
    })
  }
}

module.exports = orderService