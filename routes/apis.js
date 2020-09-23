const express = require('express')
const router = express.Router()
const restController = require('../controllers/api/restController')

router.get(
  '/restaurants',
  restController.getRestaurants
)

module.exports = router