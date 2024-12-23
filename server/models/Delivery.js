const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db-connect.js');

const Delivery = sequelize.define('Delivery', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position_latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  position_longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'deliveries',
  timestamps: false,
});

module.exports = Delivery;