const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Delivery = sequelize.define('Delivery', {
  postmanId: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  estimatedTime: { type: DataTypes.TIME },
  actualTime: { type: DataTypes.TIME },
  route: { type: DataTypes.JSON },
});

module.exports = Delivery;
