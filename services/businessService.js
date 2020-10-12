const db = require('../models')
const Restaurant = db.Restaurant

const businessService = {
  async getRestaurant (req, res, callback) {
    try {
      const restaurantId = req.params.id
      const restaurant = await Restaurant.findByPk(restaurantId)
      
      //加入驗證，business 使用者只能進入自己的餐廳，利用 req.user 來判斷
      

      callback({ restaurant })
      
    } catch (err) {
      res.send(err)
    }
  }
}

module.exports = businessService