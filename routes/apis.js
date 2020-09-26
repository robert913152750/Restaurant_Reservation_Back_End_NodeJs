const express = require('express')
const router = express.Router()
const restController = require('../controllers/api/restController')
const userController = require('../controllers/api/userController')

//JWT signin
router.post('/signin', userController.signIn)
// restaurant route
router.get('/home', restController.getRestaurants)
router.get('/restaurant/:id', restController.getRestaurant)

module.exports = router