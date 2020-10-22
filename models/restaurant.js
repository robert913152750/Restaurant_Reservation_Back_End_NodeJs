'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Restaurant.belongsTo(models.Category)
      Restaurant.belongsTo(models.City)
      Restaurant.belongsTo(models.User)
      Restaurant.hasMany(models.Meal)
      Restaurant.hasMany(models.Comment)
      Restaurant.hasMany(models.MealCategory)
    }
  };
  Restaurant.init({
    UserId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    CityId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    price: DataTypes.STRING,
    phone: DataTypes.STRING,
    ratingAve: DataTypes.STRING,
    maximum_seat: DataTypes.INTEGER,
    open_time: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};