const db = require('../models')
const Restaurant = db.Restaurant
const Meal = db.Meal
const MealCategory = db.MealCategory
const Category = db.Category
const mealPageLimit = 12
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const businessService = {
  async getRestaurant (req, res, callback) {
    try {
      const restaurant = await Restaurant.findOne({
        where: { UserId: Number(req.user.dataValues.id) },
        include: { model: Category }
      })
      callback({ restaurant })
    } catch (err) {
      res.send(err)
    }
  },
  async getMenu (req, res, callback) {
    try {
      let offset = 0
      const restaurant = await Restaurant.findOne({
        where: {
          UserId: req.user.dataValues.id
        }
      })

      const restaurantId = restaurant.id
      let whereQuery = {
        RestaurantId: restaurantId
      }
      let MealCategoryId = ''

      if (req.query.page) {
        offset = (req.query.page - 1) * mealPageLimit
      }
      if (req.query.MealCategoryId) {
        MealCategoryId = Number(req.query.MealCategoryId)
        whereQuery['MealCategoryId'] = MealCategoryId
      }
      const meals = await Meal.findAll({
        where: whereQuery,
        limit: mealPageLimit,
        offset: offset
      })
      const mealCategory = await MealCategory.findAll({
        where: { RestaurantId: restaurantId }
      })

      let page = Number(req.query.page) || 1
      let pages = Math.ceil(meals.count / mealPageLimit)
      let totalPage = Array.from({ length: pages }).map((_, index) => index + 1)

      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? page : page + 1

      return callback({
        meals,
        mealCategory,
        totalPage,
        prev,
        next
      })
    } catch (err) {
      res.send(err)
    }
  },
  async putRestaurant (req, res, callback) {
    try {
      const { name, categoryId, description, phone, address, open_time } = req.body
      const restaurant = await Restaurant.findOne({
        where: {
          UserId: req.user.dataValues.id
        }
      })

      if (!name || !categoryId) {
        return callback({ status: 'error', message: '請輸入餐廳名稱和類別' })
      }
      const { file } = req
      // const restaurant = await Restaurant.findByPk(restaurantId)

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          return restaurant.update({
            name, phone, description, address, open_time,
            CategoryId: categoryId,
            image: img.data.link
          }).then(() => {
            callback({ status: 'success', message: '成功更新餐廳' })
          })
        })
      } else {
        return restaurant.update({
          name, phone, description, address, open_time,
          CategoryId: categoryId,
          image: restaurant.image
        }).then(() => {
          callback({ status: 'success', message: '成功更新餐廳' })
        })
      }
    } catch (err) {
      console.error(err)
      callback({ status: 'error', message: '無法更新餐廳，請稍後再試' })
    }
  },
  async putMenu (req, res, callback) {
    try {
      const { MealId, name, MealCategoryId, description, price, isSale } = req.body
      if (isSale === null) return isSale = false
      if (!name || !MealCategoryId || !price) {
        return callback({ status: 'error', message: '名稱、類別、價格為必填' })
      }
      const { file } = req
      const meal = await Meal.findByPk(MealId)
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          return meal.update({
            name, description, price, isSale, MealCategoryId,
            image: img.data.link
          }).then(() => {
            callback({ status: 'success', message: '成功更改餐點資訊' })
          })
        })
      } else {
        return meal.update({
          name, description, price, isSale, MealCategoryId,
          image: meal.image
        }).then(() => {
          callback({ status: 'success', message: '成功更改餐點資訊' })
        })
      }
    } catch (err) {
      console.error(err)
      callback({ status: 'error', message: '更新失敗，請稍後再試' })
    }
  },
  async postMeal (req, res, callback) {
    try {
      const restaurant = await Restaurant.findOne({
        where: {
          UserId: req.user.dataValues.id
        }
      })
      const restaurantId = restaurant.id
      const { file } = req
      const { name, MealCategoryId, description, price, isSale } = req.body

      if (!name || !MealCategoryId || !price) {
        throw new Error()
      }

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          return Meal.create({
            name, MealCategoryId, description, price, isSale,
            RestaurantId: restaurantId,
            image: img.data.link
          }).then((meal) => {
            callback({ status: 'success', message: '成功新增餐點', meal })
          })
        })
      } else {
        return Meal.create({
          name, MealCategoryId, description, price, isSale,
          RestaurantId: restaurantId
        }).then((meal) => {
          callback({ status: 'success', message: '成功新增餐點', meal })
        })
      }
    } catch (err) {
      callback({ status: 'error', message: '新增餐點失敗，請稍後再試' })
    }
  }
}

module.exports = businessService