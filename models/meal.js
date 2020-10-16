'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Meal.hasMany(models.OrderItem)
      Meal.belongsTo(models.Restaurant)
      Meal.belongsTo(models.MealCategory)
    }
  };
  Meal.init({
    RestaurantId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    MealCategoryId: DataTypes.INTEGER,
    isSale: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Meal',
  });
  return Meal;
};