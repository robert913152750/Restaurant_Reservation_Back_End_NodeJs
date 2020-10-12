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
    if (!req.body.info.seat || !req.body.info.time || !req.body.info.name || !req.body.info.phone || !req.body.info.date || !req.body.info.totalPrice) {
      return callback({ status: 'error', message: '所有欄位為必填' })
    }
    const seatCount = req.body.info.seat
    const time = req.body.info.time
    const name = req.body.info.name
    const phone = req.body.info.phone
    const date = req.body.info.date
    const note = req.body.info.note
    const totalPrice = req.body.info.totalPrice

    RestaurantSeat.findOne({
      where: { RestaurantId: req.params.id }
    }).then((seat) => {
      Order.create({
        UserId: Number(req.user.dataValues.id),
        RestaurantSeatsId: Number(seat.dataValues.id),
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
  }
}

module.exports = userService