'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medication_status extends Model {
    static associate(models) {
      medication_status.belongsTo(models.users, {
        foreignKey: "user_id"
      });
      medication_status.belongsTo(models.medications, {
        foreignKey: "medication_id"
      });
    }
  }
  medication_status.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.TINYINT
    }
  }, {
    sequelize: sequelize,
    timestamps: true,
    modelName: 'medication_status',
    paranoid: true
  });
  return medication_status;
};