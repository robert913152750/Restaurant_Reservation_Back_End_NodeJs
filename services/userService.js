const db = require('../models')
const User = db.User
const Comment = db.Comment


let userService = {
  postComment: (req, res, callback) => {
    if (!req.body.rating) return callback({ status: 'error', message: '評分為必填' })
    Comment.create({
      UserId: req.user.dataValues.id,
      RestaurantId: req.body.RestaurantId,
      content: req.body.content,
      rating: req.body.rating
    }).then(comment => {
      return callback({
        status: 'success',
        message: '評論新增成功',
        comment: comment
      })
    })
      .catch(err => res.send(err))
  }

}

module.exports = userService