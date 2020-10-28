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
    try {
      if (!req.body.info.seat || !req.body.info.time || !req.body.info.name || !req.body.info.phone || !req.body.info.date || !req.body.totalPrice || !req.body.MerchantOrderNo) {
        return callback({ status: 'error', message: '所有欄位為必填' })
      }
      const { time, name, phone, date, note } = req.body.info
      const RestaurantId = req.params.id
      const totalPrice = req.body.totalPrice
      const MerchantOrderNo = req.body.MerchantOrderNo
      const seatCount = req.body.info.seat

      const order = await Order.create({
        UserId: Number(req.user.dataValues.id),
        time: time.toString(),
        RestaurantId: Number(RestaurantId),
        peopleCount: seatCount,
        note: note,
        reserve_name: name,
        reserve_phone: phone,
        date: date.toString(),
        totalPrice: Number(totalPrice),
        MerchantOrderNo: MerchantOrderNo
      })

      let meals = req.body.orders
      await OrderItem.bulkCreate(
        Array.from({ length: meals.length }).map((_, index) => ({
          MealId: Number(meals[index].id),
          OrderId: Number(order.dataValues.id),
          quantity: Number(meals[index].quantity)
        }))
      )
      return callback({
        status: 'success',
        message: '訂位&訂餐成功',
        order: order
      })

    } catch (err) {
      console.log(err)
      return callback({ status: 'error', message: '交易失敗' })
    }
  },
  async cancelOrder (req, res, callback) {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({
        status: '取消訂單'
      })
      callback({
        status: 'success',
        message: '訂單取消成功',
        order: order
      })
    } catch (err) {
      console.log(err)
      callback({
        status: 'error',
        message: '訂單取消失敗'
      })
    }
  },
  async getPayment (req, res, callback) {
    try {
      const order = await Order.findByPk(req.params.id)
      const user = await User.findByPk(req.user.dataValues.id)
      const userEmail = user.email
      console.log('=========')
      const tradeInfo = payment.getTradeInfo(order.totalPrice, '餐廳訂單', userEmail)
      return callback({ payment: { order, tradeInfo } })

    } catch (err) {
      console.log(err)
      callback({
        status: 'error',
        message: 'something wrong'
      })
    }

  },
  async newebpayCallback (req, res, callback) {
    try {
      console.log('===== newebpayCallback =====')
      console.log(req.body)
      console.log('==========')
      const data = JSON.parse(payment.create_mpg_aes_decrypt(req.body.TradeInfo))
      console.log(data)
      const order = await Order.findOne({
        where: {
          MerchantOrderNo: data.Result.MerchantOrderNo
        }
      })

      order.update({
        status: '已付款'
      })

      return res.redirect('https://marcho001.github.io/reservations-front-end-vue/#/member/orders')

    } catch (err) {
      console.log(err)
      res.send(err)
    }


  }
}

module.exports = orderService