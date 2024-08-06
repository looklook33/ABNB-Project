'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey:'userId',
        onDelete:'CASCADE'
      });
      Booking.belongsTo(models.Spot, {
        foreignKey:'spotId',
        onDelete:'CASCADE'
      });

    }
  }
  Booking.init({
    spotId:{
      type:DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Spots'},
      onDelete: 'CASCADE'
    },
    userId:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references: {model: 'Users'},
      onDelete: 'CASCADE'
    },
    startDate:{
      type:DataTypes.DATE,
      allowNull:false,
      validate: {
        isDate:true,
        isAfterToday(value) {
          if(new Date(value) <= new Date()){
            throw new Error('Start date must be later than today')
          }
        }
      }
    },
    endDate:{
      type:DataTypes.DATE,
      allowNull:false,
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if(new Date(value) <= new Date(this.startDate)) {
            throw new Error('End date must be after start data')
          }
        }
      }
    } 
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};