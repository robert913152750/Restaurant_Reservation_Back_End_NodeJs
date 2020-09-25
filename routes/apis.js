const express = require('express')
const router = express.Router()
const restController = require('../controllers/api/restController')

router.get(
  '/home',
  restController.getRestaurants
)

router.get(
  '/restaurant/:id',
  restController.getRestaurant
)

module.exports = router