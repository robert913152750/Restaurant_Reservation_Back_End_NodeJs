const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/api/restController')
const userController = require('../controllers/api/userController')

//passport middleware
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedBusiness = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'business') return next()
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

//router
router.post('/signin', userController.signIn)
router.get('/home', authenticated, restController.getRestaurants)
router.get('/restaurant/:id', authenticated, restController.getRestaurant)

module.exports = router