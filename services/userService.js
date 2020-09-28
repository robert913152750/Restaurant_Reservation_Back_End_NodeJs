const db = require('../models')
const User = db.User
const Comment = db.Comment


let userService = {
  postComment: (req, res, callback) => {
    Comment.create({
      UserId: req.user.dataValues.id,
      RestaurantId: req.body.RestaurantId,
      content: req.body.content,
      rating: req.body.rating
    }).then(comment => {
      return callback({ comment: comment })
    })
      .catch(err => res.send(err))
  }

}

module.exports = userService