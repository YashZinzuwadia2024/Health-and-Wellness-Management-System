'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medication_types extends Model {
    static associate(models) {
      medication_types.belongsTo(models.medication_details, {
        foreignKey: "type_id"
      });
    }
  }
  medication_types.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.ENUM('daily', 'weekly'),
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    timestamps: true,
    modelName: 'medication_types',
    paranoid: true
  });
  return medication_types;
};