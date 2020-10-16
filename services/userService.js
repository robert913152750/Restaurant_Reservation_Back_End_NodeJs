const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Meal = db.Meal
const MealCategory = db.MealCategory
const RestaurantSeat = db.RestaurantSeat
const Order = db.Order
const OrderItem = db.OrderItem
const ordersPageLimit = 10
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const moment = require('moment')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
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
  async getOrders (req, res, callback) {
    try {
      let offset = 0
      const today = moment(new Date()).format('YYYY-MM-DD')
      let orders = {}

      if (req.query.page) {
        offset = (req.query.page - 1) * ordersPageLimit
      }

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
          ],
          offset: offset,
          limit: ordersPageLimit
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
          ],
          offset: offset,
          limit: ordersPageLimit
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
          ],
          offset: offset,
          limit: ordersPageLimit
        })
      }
      const ordersCount = orders.length
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(ordersCount / ordersPageLimit)
      const totalPages = Array.from({ length: pages }).map((_, index) => index + 1)

      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

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
      return callback({
        orders: results,
        page: page,
        totalPages: totalPages,
        prev: prev,
        next: next
      })
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  },
  async putUser (req, res, callback) {
    try {
      const { name, phone, email, password, checkPassword } = req.body
      if (!name || !phone || !email) {
        return callback({ status: 'error', message: 'name, phone, email為必填' })
      }
      if (password !== checkPassword) return callback({ status: 'error', message: '密碼與確認密碼不同' })

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
  },
  async getUserInfo (req, res, callback) {
    try {
      const user = await User.findByPk(req.user.dataValues.id)
      callback({ user: user })
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  }
}

module.exports = userService