// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/database');

// const User = sequelize.define('User', {
//   username: { type: DataTypes.STRING, allowNull: false, unique: true },
//   email: { type: DataTypes.STRING, allowNull: false, unique: true },
//   password: { type: DataTypes.STRING, allowNull: false },
// });

// module.exports = User;
          




const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.TEXT, allowNull: false },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  phone_number: { type: DataTypes.STRING },
  profile_picture_url: { type: DataTypes.TEXT },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW, onUpdate: Sequelize.NOW },
});

module.exports = User;
