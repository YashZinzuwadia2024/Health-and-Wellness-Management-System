'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reports extends Model {
    static associate(models) {
      reports.belongsTo(models.users, {
        foreignKey: "user_id"
      });
    }
  }
  reports.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    report_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    report_path: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    timestamps: true,
    modelName: 'reports',
    paranoid: true
  });
  return reports;
};