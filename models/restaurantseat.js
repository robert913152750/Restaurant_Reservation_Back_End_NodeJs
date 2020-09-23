'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RestaurantSeat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      RestaurantSeat.hasMany(models.Order)
      RestaurantSeat.belongsTo(models.Restaurant)
    }
  };
  RestaurantSeat.init({
    RestaurantId: DataTypes.INTEGER,
    seat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RestaurantSeat',
  });
  return RestaurantSeat;
};