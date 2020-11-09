const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/api/restController')
const userController = require('../controllers/api/userController')
const businessController = require('../controllers/api/businessController')
const orderController = require('../controllers/api/orderController')
const multer = require('multer')
const orderService = require('../services/orderService')
const upload = multer({ dest: 'temp/' })

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
//basic
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/get_current_user', authenticated, userController.getUser)
router.get('/home', restController.getRestaurants)
router.get('/restaurant/:id', restController.getRestaurant)
router.get('/restaurant/:id/reservation', restController.getMeals)

//common_user
router.post('/comment', authenticated, userController.postComment)
router.get('/member/orders', authenticated, userController.getOrders)
router.put('/member/edit', authenticated, upload.single('avatar'), userController.putUser)
router.get('/member/info', authenticated, userController.getUserInfo)

//orders
router.post('/order/:id', authenticated, orderController.postOrder)
router.put('/order/:id/cancel', authenticated, orderController.cancelOrder)
router.get('/order/:id/payment', authenticated, orderService.getPayment)
router.post('/newebpay/callback', orderController.newebpayCallback)

//business_user
router.get('/business/restaurant', authenticated, authenticatedBusiness, businessController.getRestaurant)
router.get('/business/menu', authenticated, authenticatedBusiness, businessController.getMenu)
router.put('/business/restaurant', authenticated, authenticatedBusiness, upload.single('image'), businessController.putRestaurant)
router.put('/business/menu', authenticated, authenticatedBusiness, upload.single('image'), businessController.putMenu)
router.post('/business/meal', authenticated, authenticatedBusiness, upload.single('image'), businessController.postMeal)
router.patch('/business/isSale/:id', authenticated, authenticatedBusiness, businessController.patchIsSale)

module.exports = router