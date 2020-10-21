'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Order.belongsTo(models.User)
      Order.belongsTo(models.RestaurantSeat)
      Order.hasMany(models.OrderItem)
      Order.hasMany(models.Payment)
    }
  };
  Order.init({
    UserId: DataTypes.INTEGER,
    RestaurantSeatId: DataTypes.INTEGER,
    time: DataTypes.STRING,
    peopleCount: DataTypes.INTEGER,
    note: DataTypes.STRING,
    reserve_name: DataTypes.STRING,
    reserve_phone: DataTypes.STRING,
    date: DataTypes.STRING,
    status: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER,
    MerchantOrderNo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};