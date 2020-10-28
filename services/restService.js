const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const City = db.City
const Comment = db.Comment
const User = db.User
const Meal = db.Meal
const MealCategory = db.MealCategory
const pageLimit = 12
const mealPageLimit = 10
const { Op } = require("sequelize");


const restService = {
  async getRestaurants (req, res, callback) {
    try {
      let offset = 0
      let whereQuery = {}
      let CategoryId = ''
      let CityId = ''
      let search = ''

      if (req.query.page) {
        offset = (req.query.page - 1) * pageLimit
      }

      if (req.query.CategoryId) {
        CategoryId = Number(req.query.CategoryId)
        whereQuery['CategoryId'] = CategoryId
      }

      if (req.query.CityId) {
        CityId = Number(req.query.CityId)
        whereQuery['CityId'] = CityId
      }

      if (req.body.search) {
        search = req.body.search
      }

      const restaurants = await Restaurant.findAndCountAll({
        include: [
          Category,
          City
        ],
        where: [
          whereQuery,
          {
            name: {
              [Op.substring]: `${search}`
            }
          }
        ],
        offset: offset,
        limit: pageLimit
      })
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(restaurants.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)

      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = restaurants.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        cityName: r.dataValues.City.name
      }))

      const categories = await Category.findAll
      const cities = await City.findAll


      return callback({
        restaurants: data,
        categories: categories,
        cities: cities,
        CategoryId: CategoryId,
        CityId: CityId,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })

    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: 'something wrong'
      })
    }
  },
  async getRestaurant (req, res, callback) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          { model: Category },
          { model: City },
          { model: Comment, include: [{ model: User }] }
        ]
      })
      callback({ restaurant })

    } catch (err) {
      console.log(err)
      return callback({
        status: 'error',
        message: 'something wrong'
      })
    }
  },
  getMeals: (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let MealCategoryId = ''
    let RestaurantId = Number(req.params.id)

    if (req.query.page) {
      offset = (req.query.page - 1) * mealPageLimit
    }

    whereQuery['RestaurantId'] = RestaurantId
    if (req.query.MealCategoryId) {
      MealCategoryId = Number(req.query.MealCategoryId)
      whereQuery['MealCategoryId'] = MealCategoryId
    }

    whereQuery['isSale'] = true

    Meal.findAndCountAll({
      include: [
        { model: MealCategory }
      ],
      where: whereQuery,
      limit: mealPageLimit,
      offset: offset
    }).then((meals) => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(meals.count / mealPageLimit)
      let totalPage = Array.from({ length: pages }).map((_, index) => index + 1)

      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? page : page + 1

      const data = meals.rows.map(m => ({
        ...m.dataValues,
      }))

      MealCategory.findAll({
        where: { RestaurantId: RestaurantId }
      }).then(categories => {
        return callback({
          meals: data,
          mealCategory: categories,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
      .catch(err => res.send(err))

  }
}

module.exports = restService