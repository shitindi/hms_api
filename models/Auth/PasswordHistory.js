const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const PasswordHistory = db.define('auth_tbl_password_history', {
   user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
   },
   password: {
    type: DataTypes.STRING(100),
    allowNull: false
   },
   start_date: {
    type: DataTypes.DATE,
    allowNull: false
   },
   end_date: {
    type: DataTypes.DATE,
    allowNull: true
   },
   is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
   }
});

  module.exports = { PasswordHistory}