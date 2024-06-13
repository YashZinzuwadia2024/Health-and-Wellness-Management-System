'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_tokens extends Model {
    static associate(models) {
      user_tokens.belongsTo(models.users, {
        foreignKey: 'user_id'
      });
    }
  }
  user_tokens.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    device_IP: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logged_in: {
      allowNull: false,
      type: Sequelize.TINYINT,
      defaultValue: 1
    },
  }, {
    sequelize: sequelize,
    timestamps: true,
    modelName: 'user_tokens',
    paranoid: true
  });
  return user_tokens;
};