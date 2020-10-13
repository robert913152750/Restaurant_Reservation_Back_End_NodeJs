const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Meal = db.Meal
const MealCategory = db.MealCategory
const RestaurantSeat = db.RestaurantSeat
const Order = db.Order
const OrderItem = db.OrderItem
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const moment = require('moment')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let userService = {
  getUser: (req, res, callback) => {
    return User.findByPk(req.user.dataValues.id, {
      include: [
        { model: Restaurant }
      ]
    }).then(user => {
      callback({ profile: user })
    })
  },
  postComment: (req, res, callback) => {
    if (!req.body.rating) return callback({ status: 'error', message: '評分為必填' })
    Comment.create({
      UserId: req.user.dataValues.id,
      RestaurantId: req.body.RestaurantId,
      content: req.body.content,
      rating: req.body.rating
    }).then(comment => {
      Restaurant.findByPk(req.body.RestaurantId, {
        include: [{ model: Comment }]
      }).then(restaurant => {
        const ratingAverage = function () {
          let ratingTotall = 0
          for (i = 0; i < restaurant.Comments.length; i++) {
            ratingTotall += restaurant.Comments[i].rating
          }
          return (ratingTotall / restaurant.Comments.length).toFixed(1)
        }
        let ratingAve = ratingAverage(restaurant)
        restaurant.update({
          ratingAve: ratingAve.toString()
        }).then(restaurant => {
          return callback({
            status: 'success',
            message: '評論新增成功',
            comment: comment
          })
        })
      })

    })
      .catch(err => res.send(err))
  },
  postReservation: (req, res, callback) => {
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
  async getOrders (req, res, callback) {
    try {
      const today = moment(new Date()).format('YYYY-MM-DD')
      let orders = {}
      if (req.query.type === 'coming') {
        orders = await Order.findAll({
          where: {
            UserId: Number(req.user.dataValues.id),
            date: {
              [Op.gte]: [today]
            }
          },
          include: [
            { model: OrderItem, include: { model: Meal } },
            { model: RestaurantSeat, include: { model: Restaurant } }
          ]
        })
      }
      if (req.query.type === 'history') {
        orders = await Order.findAll({
          where: {
            UserId: Number(req.user.dataValues.id),
            date: {
              [Op.lte]: [today]
            }
          },
          include: [
            { model: OrderItem, include: { model: Meal } },
            { model: RestaurantSeat, include: { model: Restaurant } }
          ]
        })
      }
      if (req.query.type === 'unpaid') {
        orders = await Order.findAll({
          where: {
            UserId: Number(req.user.dataValues.id),
            status: '未付款'
          },
          include: [
            { model: OrderItem, include: { model: Meal } },
            { model: RestaurantSeat, include: { model: Restaurant } }
          ]
        })
      }
      const results = orders.map((item, index) => ({
        id: item.id,
        peopleCount: item.peopleCount,
        time: item.name,
        note: item.note,
        reserve_name: item.reserve_name,
        reserve_phone: item.reserve_phone,
        date: item.date,
        status: item.status,
        OrderItems: item.OrderItems.map((m, _) => ({
          id: m.id,
          MealId: m.Meal.id,
          name: m.Meal.name,
          quantity: m.quantity,
          price: m.Meal.price
        })),
        restaurantName: item.RestaurantSeat.Restaurant.name
      }))
      return callback({ orders: results })
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  },
  async putUser (req, res, callback) {
    try {
      const { name, phone, email, password, password2 } = req.body
      if (!name || !phone || !email) {
        return callback({ status: 'error', message: 'name, phone, email為必填' })
      }
      if (password !== password2) return callback({ status: 'error', message: '密碼與確認密碼不同' })

      let emailCheck = await User.findOne({
        where: {
          email: email,
          [Op.not]: { id: req.user.dataValues.id }
        }
      })
      if (emailCheck) return callback({ status: 'error', message: ' 信箱重複' })

      const userId = req.user.dataValues.id
      const { file } = req
      let user = await User.findByPk(userId)

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        await imgur.upload(file.path, (err, img) => {
          user.update({
            name: name,
            phone: phone,
            email: email,
            password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password,
            avatar: img.data.link
          })
        })
        return callback({ status: 'success', message: '會員資料更新成功' })
      } else {
        await user.update({
          name: name,
          phone: phone,
          email: email,
          password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password,
          avatar: user.avatar
        })
        return callback({ status: 'success', message: '會員資料更新成功' })
      }
    } catch (err) {
      console.log(err)
      return callback({ status: 'error', message: '暫時無法更新，稍後在試' })
    }
  }
}

module.exports = userService