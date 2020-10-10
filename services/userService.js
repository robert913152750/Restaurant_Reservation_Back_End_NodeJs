const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Meal = db.Meal
const MealCategory = db.MealCategory
const RestaurantSeat = db.RestaurantSeat
const Order = db.Order
const OrderItem = db.OrderItem



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
    if (!req.body.peopleCont || !req.body.time || !req.body.reserveName || !req.body.reservePhone || !req.body.date) {
      return callback({ status: 'error', message: '所有欄位為必填' })
    }

    RestaurantSeat.findOne({
      where: { RestaurantId: req.params.id }
    }).then((seat) => {
      console.log(req.params.id)
      console.log(seat)
      Order.create({
        UserId: req.user.dataValues,
        RestaurantSeatId: seat.id,
        time: req.body.time,
        peopleCont: req.body.peopleCont,
        note: req.body.note,
        reserveName: req.body.reserveName,
        reservePhone: req.body.reservePhone,
        date: req.body.date
      }).then((order) => {
        let meals = req.body.orders

        OrderItem.bulkCreate(
          Array.from({ length: meals.length }).map((_, index) => ({
            MealId: meals[index][id],
            OrderId: order.id,
            quantity: meals[index][quantity]
          }))
        ).then((bulk) => {
          let restSeat = seat.seat - order.peopleCont
          RestaurantSeat.update({
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
    // .catch(err => res.send(err))
  }
}

module.exports = userService