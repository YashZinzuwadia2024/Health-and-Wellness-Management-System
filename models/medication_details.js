'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medication_details extends Model {
    static associate(models) {
      medication_details.belongsTo(models.medications, {
        foreignKey: "medication_details_id"
      });
      medication_details.hasOne(models.medication_types, {
        foreignKey: "type_id"
      });
    }
  }
  medication_details.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    day: {
      type: DataTypes.STRING
    },
    isDone: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    }
  }, {
    sequelize: sequelize,
    timestamps: true,
    modelName: 'medication_details',
    paranoid: true
  });
  return medication_details;
};