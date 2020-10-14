const userService = require('../../services/userService')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      return res.json({ status: 'error', message: '密碼與確認密碼不同' })
    }
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) return res.json({ status: 'error', message: '信箱重複' })
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
        role: 'common'
      }).then(user => {
        return res.json({ status: 'success', message: '帳號註冊成功' })
      })
    })

  },
  signIn: (req, res) => {
    //檢查是否為空值
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: 'required field didn\'t exist' })
    }
    // 檢查user與密碼是否正確
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'user is not found' })

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords didn\'t match' })
      }

      let payload = { id: user.id }
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: user
      })
    })
  },
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      return res.json(data)
    })
  },
  postComment: (req, res) => {
    userService.postComment(req, res, (data) => {
      return res.json(data)
    })
  },
  postReservation: (req, res) => {
    userService.postReservation(req, res, (data) => {
      return res.json(data)
    })
  },
  getOrders: (req, res) => {
    userService.getOrders(req, res, (data) => {
      return res.json(data)
    })
  },
  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      return res.json(data)
    })
  },
  getUserInfo: (req, res) => {
    userService.getUserInfo(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = userController