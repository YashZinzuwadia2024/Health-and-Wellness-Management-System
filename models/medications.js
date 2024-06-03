'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medications extends Model {
    static associate(models) {
      medications.belongsTo(models.users, {
        foreignKey: "user_id"
      });
      medications.hasOne(models.medication_details, {
        foreignKey: "medication_details_id"
      });
    }
  }
  medications.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    medicine_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    timestamps: true,
    modelName: 'medications',
    paranoid: true
  });
  return medications;
};