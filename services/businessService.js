const db = require('../models')
const Restaurant = db.Restaurant
const Meal = db.Meal
const MealCategory = db.MealCategory
const mealPageLimit = 12
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '225003753cdca23'

const businessService = {
  async getRestaurant (req, res, callback) {
    try {
      const restaurantId = req.params.id
      const restaurant = await Restaurant.findByPk(restaurantId)
      
      //加入驗證，business 使用者只能進入自己的餐廳，利用 req.user 來判斷
      // if (req.user.dataValue.restaurantId !== restaurantId ) {
      //   throw new Error()
      // }


      callback({ restaurant })
      
    } catch (err) {
      res.send(err)
    }
  },
  async getMenu (req, res, callback) {
    try {
      const restaurantId = req.params.id
      let offset = 0
      let whereQuery = {
        RestaurantId: restaurantId
      }
      let MealCategoryId = ''

      if (req.query.page) {
        offset = (req.query.page -1) * mealPageLimit
      }
      if (req.query.MealCategoryId) {
        MealCategoryId = req.query.MealCategoryId
        whereQuery['MealCategoryId'] = MealCategoryId
      }
      const meals = await Meal.findAll({
        where: whereQuery,
        limit: mealPageLimit,
        offset: offset
       })
       const mealCategory = await MealCategory.findAll({
         where: { RestaurantId: restaurantId}
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
      const { name, category, description, phone, address } = req.body
      const { id: restaurantId } = req.params
      if (!name) {
        return callback({ status: 'error', message: '請輸入餐廳名稱'})
      }
      const { file } = req
      const restaurant = await Restaurant.findByPk(restaurantId)

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          return restaurant.update({
            name, phone, category, description, address,
            image: img.data.link
          }).then(() => {
            callback({ status: 'success', message: '成功更新餐廳'})
          })
        })
      } else {
        return restaurant.update({
          name, phone, category, description, address,
          image: restaurant.image
        }).then(() => {
          callback({ status: 'success', message: '成功更新餐廳'})
        })
      }
    } catch (err) {
      callback({ status: 'error', message: '無法更新餐廳，請稍後再試'})
    }
  }
}

module.exports = businessService