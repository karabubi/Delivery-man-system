// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/database');

// const Delivery = sequelize.define('Delivery', {
//   postmanId: { type: DataTypes.INTEGER, allowNull: false },
//   address: { type: DataTypes.STRING, allowNull: false },
//   estimatedTime: { type: DataTypes.TIME },
//   actualTime: { type: DataTypes.TIME },
//   route: { type: DataTypes.JSON },
// });

// module.exports = Delivery;


// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Delivery = sequelize.define('Delivery', {
//   userId: { type: DataTypes.INTEGER, allowNull: false },
//   address: { type: DataTypes.STRING, allowNull: false },
//   positionLatitude: { type: DataTypes.FLOAT },
//   positionLongitude: { type: DataTypes.FLOAT },
// });

// module.exports = Delivery;

//------26-11-24

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
