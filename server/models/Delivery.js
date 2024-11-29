
const db = require('../db');

const Delivery = db.define('Delivery', {
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
});

module.exports = Delivery;
