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


const restService = {
  getRestaurants: (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let CategoryId = ''
    let CityId = ''

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

    Restaurant.findAndCountAll({
      include: [
        Category,
        City
      ],
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(restaurants => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(restaurants.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)

      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1


      const data = restaurants.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        cityName: r.dataValues.City.name
      }))

      Category.findAll({
      }).then(categories => {
        City.findAll({
        }).then(cities => {
          return callback({
            restaurants: restaurants,
            categories: categories,
            cities: cities,
            CategoryId: CategoryId,
            CityId: CityId,
            page: page,
            totalPage: totalPage,
            prev: prev,
            next: next
          })
        })
      })
    })
      .catch(err => res.send(err))
  },
  getRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: City },
        { model: Comment, include: [{ model: User }] }
      ]
    }).then(restaurant => {
      callback({
        restaurant: restaurant
      })
    })
      .catch(err => res.send(err))
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
        mealCategory: m.dataValues.MealCategory.name
      }))

      MealCategory.findAll({
        where: { RestaurantId: RestaurantId }
      }).then(categories => {
        return callback({
          meal: data,
          mealCategory: categories,
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